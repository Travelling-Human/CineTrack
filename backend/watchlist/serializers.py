from rest_framework import serializers
from .models import WatchlistEntry


class WatchlistEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistEntry
        fields = [
            'id', 'imdb_id', 'title', 'year',
            'poster', 'status', 'notes',
            'added_at', 'updated_at'
        ]
        read_only_fields = ['id', 'added_at', 'updated_at']