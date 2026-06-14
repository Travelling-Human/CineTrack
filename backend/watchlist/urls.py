from django.urls import path
from .views import WatchlistView, WatchlistEntryView, WatchlistDownloadView

urlpatterns = [
    path('', WatchlistView.as_view(), name='watchlist'),
    path('<int:entry_id>/', WatchlistEntryView.as_view(), name='watchlist-entry'),
    path('download/', WatchlistDownloadView.as_view(), name='watchlist-download'),
]