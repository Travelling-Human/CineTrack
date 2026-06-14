from django.db import models
from django.contrib.auth.models import User


class WatchlistEntry(models.Model):
    STATUS_CHOICES = [
        ('watching', 'Watching'),
        ('completed', 'Completed'),
        ('planning', 'Planning to Watch'),
        ('stopped', 'Stopped'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    imdb_id = models.CharField(max_length=20)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=10, blank=True)
    poster = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'imdb_id')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} — {self.title} ({self.status})"