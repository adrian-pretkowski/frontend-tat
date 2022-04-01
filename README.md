# Time Analysis Tool

The application is used for time analysis of the mileage of electronic vehicle start at the factory.

It stores information about vehicles and the duration of the ECOS (Electric Check-Out System) test in the database.
With this application, it is possible to verify whether the time of starting ECUs in the car is consistent with the assumed time.
Additionally, the duration of activities performed by the eployee can be checked.
Information is presented using charys and tables.

## Used Technologies, Frameworks & Libraries

- Backend: 
  - Java 17 & SpringBoot
  - Hibernate
  - Spring Security (JSON Web Token)
  - Data JPA
  - Lombok
  - Maven

- Frontend:
  - JavaScript - React
  - Semantic-UI
  - Axios
  - Recharts

- Test DB: H2 

## Data Model Relationships

User --> ManyToMany --> Roles

TestPlan --> OneToOne --> Vehicle --> OneToMany --> Ecu --> OneToMany --> Function

## Demo Application 

Below is a demo version of the application - random data.

1. Loggin screen:

  ![image](https://user-images.githubusercontent.com/56799649/161324905-7944affe-9390-4390-a496-cd5ff997a778.png)
  
  The user logs in using the username and password.
  If the given user exist in the database, a JSON Web Token is sent back (Main Token + Refresh Token valid X minutes).
  
  Data stored in JWT: username and specified user roles (user/admin).

2. Vehicle View:

  ![image](https://user-images.githubusercontent.com/56799649/161326408-faa3cfeb-0e83-4ecb-862d-f78bd53f9f39.png)
  
  In this view user can choose specific Vehicle and TestLocation - the data is presented in the form of a table.
  User can also add a new vehicle.
  
  ![image](https://user-images.githubusercontent.com/56799649/161326535-b4c8e92e-a82c-4f3d-85ea-90bdd14d452c.png)

  The user can delete the vehicle or view its details.
  
  ![image](https://user-images.githubusercontent.com/56799649/161328004-efd64d83-d987-42fa-875a-6a5a5c989059.png)

  By clicking on a single ECU the user can see the details of that ECU.
  
  ![image](https://user-images.githubusercontent.com/56799649/161329235-1b1d3906-a21f-42b5-aefc-011fb6843b0a.png)
  
  By clicking on a Function Button the user can see all functions in selected vehicle and sort the data.

  ![image](https://user-images.githubusercontent.com/56799649/161329375-717ee204-fc51-47b4-969d-6343dcbe0785.png)
  
  2. Ecu View:

  ![image](https://user-images.githubusercontent.com/56799649/161329594-5a00fec7-f8d1-47eb-92f4-2400ebff35c0.png)
  
  In this view user can find the ECU based on selected vehicle and specific test location.
  
  ![image](https://user-images.githubusercontent.com/56799649/161329852-7e29b6dc-f5f1-4efd-9395-1adc2a9a3aa7.png)
  
  By clicking on details button the user can see more details about the ECU - ECUs stored in database, durations and more.

  3. Function View:

  ![image](https://user-images.githubusercontent.com/56799649/161330164-f7f39d42-4658-48ad-bd15-5cd47d6c6072.png)

  This view shows all ECUs based on selected vehicle. Then user can select single ECU.
  
  ![image](https://user-images.githubusercontent.com/56799649/161330286-dfc8d91b-5217-4919-a76e-c73abbcb0dc8.png)
  
  The user can then select a specific function and check its details.

  ![image](https://user-images.githubusercontent.com/56799649/161330331-adc4f5b7-7ec9-47ee-af9c-eb791f949040.png)

  4. Admin dashboard:

  ![image](https://user-images.githubusercontent.com/56799649/161330836-97b114db-2123-47da-8740-063e0361a487.png)

  In Admin panel a user with admin rights can manage all users.
  
  Admin can add a new user - 100% form validation, checks if user with given username/e-mail exists in DB.
  Admin can also delete an existing user or grant him additional rights.
