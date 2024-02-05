# Carousal Offer Docs

## Routes

### 1. Create New Offer 

Upload an image to be rendered in the in-app
Route:
```
    /api/offers/createOffer
```
Method: POST,
Note: File upload requires the use of the FormData API, which is a JavaScript API for creating and sending form data.

We create a new FormData object from the form and use the fetch API to send a POST request to the route endpoint with the FormData object as the request body.

The field of file should be 'image'

### 2. Get All Offers
Route
``` 
    /api/offers/getCarousal
```
Method: GET,
Returns an array of all the offers present in the db


### 3. Delete Offer

Remove a specific offer from the db
Route
``` 
    /api/offers/deleteOffer

```

Method: DELETE
Fields: Specify the database id of the carousal that is available from getCarousal Route as query param id.

Example:
```
    /api/offers/deleteOffer?id=65b7e5b655eae0b93b56f540
```