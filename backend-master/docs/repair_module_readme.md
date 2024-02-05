# Documentation for Repair Management Module

## Routes

### Add New Category
Route:

```
    /api/repairs/addCategory
```

Method: POST   
Type: urlencoded  

Fields
 value | type | required |
| -------- | -------- | -------- |
| categoryName | string | 

### Add Category Image

This same route can be used to add or update the images of the category which are currently present in the db.

Route:
```
    /api/repairs/uploadCategoryImage
```
Note: File upload requires the use of the FormData API, which is a JavaScript API for creating and sending form data.

We create a new FormData object from the form and use the fetch API to send a POST request to the /api/repairs/uploadCategoryImage endpoint with the FormData object as the request body.

The field of file should be 'image'


Method: POST,

Fields: _id from the database as query parameter


### Update Category 

Route:

```
    /api/repairs/updateCategory
```

Method: POST   

Use db _id as a query param

Example:

```
    /api/repairs/updateCategory?id=657dcc7a306dad1f93f0ffc2
```

Fields
 value | type | required |
| -------- | -------- | -------- |
| categoryName | string | 


### List All Categories

Lists all the categories present in the database

Route:
```
    api/repairs/listCategories
```
Method: GET

Response : An array of all categories

### Delete A Category

Delete a specific category from the database

Route
```
    api/repairs/deleteCategory
```
Method: DELETE

Fields:
id of Category as query parameter
Example:
```
    api/repairs/deleteCategory?id=_id
```


Note: Deleting a specific category will cause deletion of all child brands and child models under that
specific category as they have a Parent-Child Relationship. So it will be recursive deletion

### Add New Brand In A Category

Route:

```
    /api/repairs/addBrand
```

Method: POST   

query param: id of category from database;

Example:
```
    /api/repairs/addBrand?id=657dcc7a306dad1f93f0ffc2
```

Fields
 value | type | info |
| -------- | -------- |
| brandName | string |


### Add Brand Image

This same route can be used to add or update the images of the brand which are currently present in the db.

Route:

    api/repairs/uploadBrandImage?id=_id

Note: File upload requires the use of the FormData API, which is a JavaScript API for creating and sending form data.

We create a new FormData object from the form and use the fetch API to send a POST request to the /api/repairs/uploadBrandImage endpoint with the FormData object as the request body.

The field of file should be 'image'

Method: POST,

Fields: _id from the database as query parameter


### List All Brands In A Category

Lists all the brands in a specified category present in the database

Route:
```
    api/repairs/listBrands
```
Method: GET

Query Params of id of category from database

Usage
```
    api/repairs/listBrands?id=657de637c4d6f7717a0ebbe0
```

Response : An array of all brands in the category of the id


### Update Brand

Route:

```
    /api/repairs/updateBrand
```

Method: POST   

Use db _id as a query param

Example:

```
    /api/repairs/updateBrand?id=657dcc7a306dad1f93f0ffc2
```

Fields
 value | type | required |
| -------- | -------- | -------- |
| brandName | string | 


### Delete A Brand

Delete a specific Brand from the database

Route
```
    api/repairs/deleteBrand
```
Method: DELETE

Fields:
id of Brand as query parameter
Example:
```
    api/repairs/deleteBrand?id=_id
``` 

Note: Deleting a specific brand will cause deletion of all child models under that
specific brand.


### Add New Model/Product In A Brand

Route:

```
    /api/repairs/addModel
```

Method: POST   

query param: id of brand from database;


Example:
```
    /api/repairs/addModel?id=657de34f651020d6e1ae336f
```

Fields
 value | type | info |
| -------- | -------- | -------- |
| modelName | string


### Add Model Image

This same route can be used to add or update the images of the model which are currently present in the db.

Route:

    api/repairs/uploadModelImage?id=_id

Note: File upload requires the use of the FormData API, which is a JavaScript API for creating and sending form data.

We create a new FormData object from the form and use the fetch API to send a POST request to the /api/repairs/uploadModelImage endpoint with the FormData object as the request body.

The field of file should be 'image'

Method: POST,

Fields: _id from the database as query parameter


### List All Models

Lists all the models in a specified id of brand

Route:
```
    api/repairs/listModels
```
Method: GET 

Query Params of id from database

Usage
```
    api/repairs/listModels?id=657de637c4d6f7717a0ebbe0
```

Responds with an array of models


### Update Model


Route:

```
    /api/repairs/updateModel
```

Method: POST   

Use db _id as a query param

Example:

```
    /api/repairs/updateModel?id=657dcc7a306dad1f93f0ffc2
```

Fields
 value | type | required |
| -------- | -------- | -------- |
| modelName | string | 


### Delete A Model

Delete a specific model from the database

Route
```
    api/repairs/deleteModel
```
Method: DELETE

Fields:
id of Model as query parameter
Example:
```
    api/repairs/deleteModel?id=_id
``` 

Note: Deleting a specific model will cause deletion of all child issues under that
specific model.


### Add New Global Issue

Adds a global issue to the database

Route
```
    api/repairs/addGlobalIssue
```
Method: POST

Fields:
Fields
 value | type | required |
| -------- | -------- | -------- |
| issueName | string |
| issueDescription | string |

### Upload Global Issue Image

This same route can be used to add or update the images of the global issues which are currently present in the db.

Route:
```
    /api/repairs/uploadIssueImage
```

Note: File upload requires the use of the FormData API, which is a JavaScript API for creating and sending form data.

We create a new FormData object from the form and use the fetch API to send a POST request to the /api/repairs/uploadBrandImage endpoint with the FormData object as the request body.

The field of file should be 'image'

Method: POST,

Fields: _id from the database as query parameter

### List All Global Issues

Lists all the global issues

Route
```
    api/repairs/listGlobalIssues
```
Method: GET,

Returns an array of all the global issues in the database


### Update Global Issue 

Route:

```
    /api/repairs/updateGlobalIssue
```

Method: POST   

Use db _id as a query param

Example:

```
    /api/repairs/updateGlobalIssue?id=657eea2462036e7a1d7df863
```

Fields
 value | type | required |
| -------- | -------- | -------- |
| issueName | string |
| issueDescription | string |

### Delete A Global Issue

Delete A global Issue from the database

Route
```
    /api/repairs/deleteGlobalIssue
```
Method: DELETE

Fields:
id of global Issue as query parameter
Example:
```
    /api/repairs/deleteGlobalIssue?id=657eedc39341d3cc78ca9181
``` 

### Add an issue to a Model

This route select and create a model issue by refering to the selected global issue

Route:
```
    api/repairs/addModelIssues

```
Method: POST

Provide modelId and issueId of global issue as query params. See the example usage below

Fields 
 value | type | info |
| -------- | -------- | -------- |
| issueCost | float | Cost to fix the issue


Usage:
URL:
```
    /api/repairs/addModelIssues?modelId=65809ac16fe8786ca6b8a91e&issueId=65809766257758316369d90f
```

Note2: modelId --> id of the model for which the global issue is selected
       issueId --> id of the global issue selected


### List the individual issues of a Model

Route:
```
    api/repairs/listIssues
```
Method: GET 

Query Params of id of the parent model from database

Usage
```
    api/repairs/listIssues?id=657de637c4d6f7717a0ebbe0
```

Responds with an array of issues of that model


### Delete An Individual Model Issue

This route is used to delete the individual model issues of a model without deleting the global issue

Route
```
    /api/repairs/deleteIssue
```
Method: DELETE,


Usage:
```
    /api/repairs/deleteIssue?id=65809f7f27f3ac7f5cad4fbc
```