# Visualization Project

## Data
I got the all the data using the api endpoint: https://controllerdata.lacity.org/resource/pggv-e4fn.json
The data sometimes took ages, so I decided against ajax and stored the necessary data in json files. I stored the data unformatted.

I format the data in javascript. I would prefer to do this on the backend, but the instructions said js,html,css.

## Tools Used
- D3 - I have never used D3 before, but I have been wanting to take a stab at it for a while.
- Bootstrap - Just for the basic layout.
- jQuery - For odds and ends, probably could have done without it.

## Running The Code
I just use the built in php server to serve the content locally. To do this clone the folder, navigate to it in console and run:
```
php -S 127.0.0.1:8000 -t .
```
Then go to http://localhost:8000 in your browser.

## What Else Would I Add?
If I had more time I would add a map view of spend by zip code.

If I had access to the database and could apply indexes to the data (I can't because I am using the api), I would also do some more creative, drilldown charts. The main problem was the API calls took a long time on such a large dataset.


## Questions?
Let's talk about them!