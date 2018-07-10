from django.shortcuts import render
from rest_framework import generics
from .serializers import ParkingDataSerializer
from .models import ParkingData


# views and urls for handling the POST request.
class CreateView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = ParkingData.objects.all()
    serializer_class = ParkingDataSerializer

    def perform_create(self, serializer):
        """Save the post data when creating a new parkingdata."""
        serializer.save()


class DetailsView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = ParkingData.objects.all()
    serializer_class = ParkingDataSerializer


class NameView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        """
        This view should return a list of all the parkingdata
        with current name.
        """
        parkingname = self.kwargs['name']
        return ParkingData.objects.filter(name=parkingname)


class NoNameView(generics.ListAPIView):
    """wrote this class to test dhe exclude() method"""
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        """
        This view should return a list of all the parkingdata
        with current name.
        """
        parkingname = self.kwargs['name']
        return ParkingData.objects.exclude(name=parkingname)


class IDsView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        queryset = ParkingData.objects.all()
        """
        This view should return a list of all the parkingdata
        with current name.
        """
        for x in range(int(self.kwargs['id1']), int(self.kwargs['id2'])):
            queryset = queryset.exclude(id=x)
        return queryset
