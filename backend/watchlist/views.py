from django.shortcuts import render
import json
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import WatchlistEntry
from .serializers import WatchlistEntrySerializer


class WatchlistView(APIView):

    def get(self, request):
        filter_status = request.query_params.get('status', None)
        entries = WatchlistEntry.objects.filter(user=request.user)

        if filter_status:
            entries = entries.filter(status=filter_status)

        serializer = WatchlistEntrySerializer(entries, many=True)

        # Group by status for a nice summary
        summary = {
            'watching': entries.filter(status='watching').count(),
            'completed': entries.filter(status='completed').count(),
            'planning': entries.filter(status='planning').count(),
            'stopped': entries.filter(status='stopped').count(),
            'total': entries.count(),
        }

        return Response({
            'summary': summary,
            'results': serializer.data,
        })

    def post(self, request):
        serializer = WatchlistEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WatchlistEntryView(APIView):

    def get_object(self, user, entry_id):
        try:
            return WatchlistEntry.objects.get(id=entry_id, user=user)
        except WatchlistEntry.DoesNotExist:
            return None

    def patch(self, request, entry_id):
        entry = self.get_object(request.user, entry_id)
        if not entry:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WatchlistEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, entry_id):
        entry = self.get_object(request.user, entry_id)
        if not entry:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response({'message': 'Removed from watchlist'}, status=status.HTTP_204_NO_CONTENT)


class WatchlistDownloadView(APIView):

    def get(self, request):
        fmt = request.query_params.get('format', 'json')
        entries = WatchlistEntry.objects.filter(user=request.user).order_by('status', 'title')
        serializer = WatchlistEntrySerializer(entries, many=True)
        data = serializer.data

        if fmt == 'txt':
            lines = [f"CineTrack Watchlist — {request.user.username}\n"]
            lines.append("=" * 40 + "\n")

            categories = [
                ('watching', '🎬 Currently Watching'),
                ('completed', '✅ Completed'),
                ('planning', '📋 Planning to Watch'),
                ('stopped', '🛑 Stopped'),
            ]

            for status_key, label in categories:
                group = [e for e in data if e['status'] == status_key]
                if group:
                    lines.append(f"\n{label} ({len(group)})\n")
                    lines.append("-" * 30 + "\n")
                    for e in group:
                        lines.append(f"  • {e['title']} ({e['year']})\n")
                        if e['notes']:
                            lines.append(f"    Notes: {e['notes']}\n")

            content = ''.join(lines)
            response = HttpResponse(content, content_type='text/plain')
            response['Content-Disposition'] = 'attachment; filename="watchlist.txt"'
            return response

        else:
            export = {
                'user': request.user.username,
                'exported_at': str(entries.first().updated_at if entries.exists() else ''),
                'watchlist': data,
            }
            content = json.dumps(export, indent=2, default=str)
            response = HttpResponse(content, content_type='application/json')
            response['Content-Disposition'] = 'attachment; filename="watchlist.json"'
            return response