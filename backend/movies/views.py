from django.shortcuts import render
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


OMDB_BASE = 'http://www.omdbapi.com/'


class SearchMoviesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        page = request.query_params.get('page', 1)

        if not query:
            return Response(
                {'error': 'Query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(OMDB_BASE, params={
            'apikey': settings.OMDB_API_KEY,
            's': query,
            'page': page,
            'type': 'movie',
        })

        data = response.json()

        if data.get('Response') == 'False':
            return Response(
                {'error': data.get('Error', 'No results found')},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            'results': data.get('Search', []),
            'total': data.get('totalResults', 0),
            'page': page,
        })


class MovieDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, imdb_id):
        response = requests.get(OMDB_BASE, params={
            'apikey': settings.OMDB_API_KEY,
            'i': imdb_id,
            'plot': 'full',
        })

        data = response.json()

        if data.get('Response') == 'False':
            return Response(
                {'error': data.get('Error', 'Movie not found')},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(data)