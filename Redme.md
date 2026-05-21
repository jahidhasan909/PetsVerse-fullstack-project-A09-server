* PETSVERSE Project:

* PETSVERSE Adoption Server :
এখানে Express.js, MongoDB আর JWT Authentication ব্যবহার করা হয়েছে।



* Features

1. নতুন Pet Add করা যায় = `POST API`
2. সব Pets দেখা যায় = `GET API`
3. Pet Search & Filter করা যায় = `GET API`
4. Single Pet Details দেখা যায় = `GET API`
5. Adoption Request পাঠানো যায় = `POST API`
6. Adoption Request Update করা যায় = `PATCH API`
7. Pet Update করা যায় = `PATCH API`
8. Pet Delete করা যায় = `DELETE API`
9. Adoption Request Delete করা যায় = `DELETE API`
10. User নিজের Added Pets দেখতে পারে = `GET API`
11. MongoDB Database ব্যবহার করা হয়েছে
12. Adoption Approve করলে Pet Automatically Adopted হয়ে যায়
13. Full Backend Protected By JWT Verification 



* Technology Used

1. Node.js
2. Express.js
3. MongoDB
4. JWT Authentication
5. dotenv
6. cors



Protected Route গুলোতে JWT Token Verify করা হয়েছে।  
Authorization Header এ Bearer Token পাঠাতে হয়।

Example:
Authorization: Bearer token