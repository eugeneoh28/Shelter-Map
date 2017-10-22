'''
Daniel

Take csv of shelter data, turn addresses into lat and long,
write back a csv with new column
'''

import googlemaps
from datetime import datetime

gmaps = googlemaps.Client(key='AIzaSyDlMbRMWybGOaTpHwixblioh-H6ZYDQEjY')



import csv
with open('Shelters.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    with open('Shelters2.csv', 'w') as writefile:
        print(type(reader.fieldnames))
        writer = csv.DictWriter(writefile, fieldnames=(reader.fieldnames + ['lng', 'lat']))
        writer.writeheader()

        for row in reader:
            coords = gmaps.geocode(', '.join([row['address'], row['city'], row['state']]))[0]['geometry']['location']
            row['lng'] = coords['lng']
            row['lat'] = coords['lat']
            writer.writerow(row)



'''
# Geocoding an address
geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')

# Look up an address with reverse geocoding
reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# Request directions via public transit
now = datetime.now()
directions_result = gmaps.directions("Sydney Town Hall",
                                     "Parramatta, NSW",
                                     mode="transit",
                                     departure_time=now)
'''
