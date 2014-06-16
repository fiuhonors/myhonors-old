## MyHonors - Bootstrap 3 compliance and CSS responsiveness branch, Bridge between Angular to PHP sessions
The main purpose of this branch is to update MyHonors to be responsive (work across multiple platforms including tablets, laptops, and smartphones). Of outmost importance in this branch is also upgrading all dependencies to their newest versions, which includes all the additional javascript modules (datepicker and timepicker), styling CSS (utilizing new Bootstrap 3 classes in the stylesheets) and upgrading HTML classname/id markups to Bootstrap 3 compliant code.

### Important Migration of Bootstrap 2-to-3 links:
* http://www.bootply.com/bootstrap-3-migration-guide
* http://code.divshot.com/bootstrap3_upgrader/
* http://getbootstrap.com/ - Bootstrap 3 Official Reference

### Development Environment
Currently, this branch can only be "gitted" (get it?) to and worked/coded on a local working environment, using the testing Firebase database. This is to prevent any problems with accidentally deleting real actual data needed to run the current system OR accidentally delete any important files that may be crucial to keeping the current system from running (which uses Bootstrap 2 instead of 3).

### Before pushing to Production
* In auth.php@line52: Change session_set_cookie_params domain to just MyHonors
* Other changes like API Key and enabling LDAP authentication (check Alberto)
