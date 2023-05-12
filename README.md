# web-film-with-NodeJS


## Getting started

This is a project about an online movie watching website.

- [ ] User-side functions: Allows users to quickly log in with their Google or Facebook accounts. has the function of forgetting password to send OTP code to email to authenticate the user, and can change the password or the user can still watch movies without an account (but there are some limitations). The homepage displays information about upcoming movies, nominated movies with the highest ratings and the latest movies that have just been updated. Dive into the movie page, here displays all movies, can use filters such as filter by genre, year of production, age, rating in addition to also have a search function for users. The detailed movie page shows detailed information of the movie such as: name, actor, director, description, rating, year of production and age to watch the movie. There is also functionality for logged in users such as rating, commenting, adding to favorites. Show movies of the same genre.
- [ ] Admin side functions: admin can manage movie genres (delete, edit) or manage movie information (add, delete, edit). Admin can also manage comments as well as user accounts to keep the movie environment "fresh".

## How to run this project

- [ ] Copy the git link to the directory you want to save, type the command
```
git clone link_project
```
- [ ] Open command line (if you have downloaded MongooseDB)
```
mongoose
```
- [ ] Move and open the command line (with NodeJS installed) in the cloned folder type the command below to download the necessary libraries for the project to work
```
npm i
```
- [ ] Continue typing the command below to start the system
```
node app.js
```
- [ ] Go to [link](http://localhost:3000) and start responding

Note: The movie's data has been added to the database at startup, the default admin account stored in the database is:
```
username: "admin"
password: "123456"
```
