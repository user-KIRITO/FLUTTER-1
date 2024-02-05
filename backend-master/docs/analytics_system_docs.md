# Documentation For Analytics

## Routes
***Note***: All the following routes requires the role of superadmin
### 1. Analytics for Today's Total Repair Orders


Route:
```
   api/analytics/todaysTotalAssignments
```

Method: GET,

Returns a count of today's total orders

### 2. Analytics for Today's Pending Repair Orders


Route:
```
   api/analytics/todaysPendingAssignments
```

Method: GET,

Returns a count of today's pending orders


### 3. Analytics for Today's Completed Repair Orders

Route:
```
   api/analytics/todaysCompletedAssigments 
```

Method: GET,

Returns a count of today's completed orders

### 4. Analytics for a Specific Date's Repair Orders

Route:
```
    api/analytics/daysTotalAssignments?date='2023-12-12'
```
Method: GET,

Fields: Pass the date in the above format as a query parameter

Return the count of orders of the given date