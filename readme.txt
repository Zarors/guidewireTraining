TrainingApp10_General_v1

Contact Manager:	Version 10.0.0.1336_20180831
Studio:				Version 2.0.4
JDK:				Version 1.8.0_181

Installer features:

1) Shortcuts in the TrainingApp directory

2) logging.properties
- The TrainingApp logs are stored in C:\GW10\TrainingApp\logs
- This ensures the log files are contained within the TrainingApp directory

3) Generated files
- Data Dictionary
- Security Dictionary

4) Database of TrainingApp original data
- A "dbbackup" directory has a copy of the database as it exists at the start of the course
- From the command line for the home directory, execute the gwb dropDb
- Copy the content of the "dbbackup" folder to the "db" folder
