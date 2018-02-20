## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. For the server constructor, it creates a mongo client and creates a mongo
   database which asks mongo client to call a certain given database. For the
   UserController constructor, it gets past a mongo database, which it sets
   to a private database and after that it gets the collection of users from
   the database.
     
2. It just iterates through the entire collection of user data that was
   specified earlier and returns the user if it has the same id as provided
   or returns null, if there is no match.
   
3. It just checks the file with queryParams if there is a match with the
   given age, and returns all the mathing results. The role of filterDoc is
   to append all the resulting matches of the set parameter to a sincle
   document.
   
4. As far as we understand, the object Document is basically placeholder of
   sorts, that we use to store key value pairs. We use them in different
   ways in the UserController class, for example filterDoc is used to hold
   filtered data, and newUser was to hold any new users that was provided
   and append it to the list that it already has.
   
5. The UserControllerSpec.clearAndPopulateDb resests the database before
   each test runs to ensure that each test recieves the exact same
   database. This makes sure that if a user is removed in a previous test,
   and isn't added back, that this user will be there before the next
   test runs.
   
6. In UserControllerSpec.getUsersWhoAre37, it is just checking to see that
   it returns the exact number of users of age 37 as expected. As to how it
   is being tested, the test goes through the list of users and checks if
   the expected names match with the ones that re found with the age of 37.
   
7. UserRequestHandler has the method that creates the space that will add
   new users and return a the helper method that is called from
   UserController and adds the new user from there.
