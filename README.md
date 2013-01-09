# MyHonors

Developed for [The Honors College at Florida International University](http://honors.fiu.edu/).

**Current Features**
* Events Calendar
* Attendance Tracker
* Citizenship Tracker
* Honors College Application

**Planned Features**
* Advanced Research Module (ARCH)
* Profiles for Students & Faculty
* Live Streams of Student Activity
* File Storage for Readings & Assignments

## Installation
We use the [CodeIgniter](http://ellislab.com/codeigniter/) PHP framework to handle data from the backend and [AngularJS](http://angularjs.org/)--an amazing Javascript framework from Google--to power the frontend. All necessary files are already included in the [MyHonors repository](https://github.com/sergiopantoja/MyHonors), so you can get started with just a few steps:

1. [Download](https://github.com/sergiopantoja/MyHonors/archive/master.zip) or [clone](https://github.com/sergiopantoja/MyHonors) the MyHonors repository.
2. Upload the files to your webserver. The **web_root** directory should be placed wherever you want MyHonors to be installed. For the best security, both the **application** and **system** folders should be placed above your server's web root so that they are not directly accessible via a browser.
3. Rename the **application/config/config.sample.php** file to **config.php** and open it with a text editor. Set your base URL and create a random encryption key.
4. Rename the **application/config/database.sample.php** file to **database.php**. Open it with a text editor and add your database information.
5. *More instructions coming soon. Go to an install page to populate the database, setup auth settings (CAS?), etc.*

## Development

#Roadmap
| Version |     | Description |
|---------|-----|-------------|
| **0.x** |     | Adding existing features into repo |
|         | 0.1 | Attendance and Events |
|         | 0.2 | User Profiles under Tank\_Auth |
|         | 0.3 | Linked Authentication with phpCAS and LDAP |
|         | 0.4 | Application |
|         | 0.5 | ARCH Registration |
| **1.x** |     | Adding Social features |
|         | 1.1 | Text posts and comments |
|         | 1.2 | Photo posts, comments, and captions |
|         | 1.3 | Private Messages |
|         | 1.4 | Automated Messages |
| **2.x** |     | Groups |
|         | 2.1 | Creating and joining groups |
|         | 2.2 | Browsing Groups |
|         | 2.3 | Managing Groups |
|         | 2.4 | Using Group filters |