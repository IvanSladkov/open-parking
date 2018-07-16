from rest_framework import generics
from .serializers import ParkingDataSerializer
from .models import ParkingData
import requests
import json
from django.http import HttpResponse
from rest_framework.decorators import api_view


class DetailsView(generics.RetrieveAPIView):
    """
    Get a detailed view of a parking by its ID
    """
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        parking_id = self.kwargs['pk']
        return ParkingData.objects.filter(id=parking_id)


class UuidView(generics.ListAPIView):
    """
    Get a detailed view of a parking by its UUID
    """
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        parking_uuid = self.kwargs['uuid']
        return ParkingData.objects.filter(uuid=parking_uuid)


@api_view(['GET'])
def getStaticUrl(request, uuid):
    """
    Get the info of the static URL of a parking with a specified UUID
    """
    url = ParkingData.objects.get(
        uuid=uuid).staticDataUrl
    r = requests.get(url)
    dump = json.dumps(r.json())
    return HttpResponse(dump, content_type='application/json')


class RectangleView(generics.ListAPIView):
    """Get all instances located in a rectangle defined by two points."""
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        southwest_lng = float(self.kwargs['southwest_lng'])
        southwest_lat = float(self.kwargs['southwest_lat'])
        northeast_lng = float(self.kwargs['northeast_lng'])
        northeast_lat = float(self.kwargs['northeast_lat'])

        return ParkingData.objects.filter(longitude__gte=southwest_lng, latitude__gte=southwest_lat, longitude__lte=northeast_lng, latitude__lte=northeast_lat)


class StaticView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        """
        This view should return a list of all the parkingdata
        with no dynamic data link .
        """
        return ParkingData.objects.filter(dynamicDataUrl__isnull=True)


class DynamicView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        """
        This view should return a list of all the parkingdata
        with a dynamic data link.
        """
        return ParkingData.objects.filter(dynamicDataUrl__isnull=False)


class CountryView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        country_code = self.kwargs['country_code']
        return ParkingData.objects.filter(country_code=country_code)


class RegionView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        regionName = self.kwargs['regionName']
        return ParkingData.objects.filter(region=regionName)


class ProvinceView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        provinceName = self.kwargs['provinceName']
        return ParkingData.objects.filter(province=provinceName)


class CityView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):
        cityName = self.kwargs['cityName']
        return ParkingData.objects.filter(city=cityName)


class OffstreetView(generics.ListAPIView):
    serializer_class = ParkingDataSerializer

    def get_queryset(self):

        return ParkingData.objects.filter(facilityType="offstreet")


@api_view(['GET'])
def getMultipleStaticUrl(request, from_id, to_id):
    static_jsons = []
    for id in range(int(from_id), int(to_id)):
        url = ParkingData.objects.get(
            id=id).staticDataUrl
        r = requests.get(url).json()
        static_jsons.append(r)
    return HttpResponse(json.dumps(static_jsons), content_type='application/json')


@api_view(['GET'])
def summaryCountryView(request, country_code):
    parkings = ParkingData.objects.filter(country_code=country_code.lower())
    data = {"name": country_code,
        "children": []
    }
    print(parkings)

    dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')
