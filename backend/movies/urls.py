from django.urls import path
from .views import SearchMoviesView, MovieDetailView

urlpatterns = [
    path('search/', SearchMoviesView.as_view(), name='search'),
    path('<str:imdb_id>/', MovieDetailView.as_view(), name='detail'),
]