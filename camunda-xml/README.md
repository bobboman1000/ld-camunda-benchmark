# Another shot at Camunda

Tested using Camunda community edition 7.14.0 and camunda-modeler-4.3.0, obtained from [Camunda's download page](https://camunda.com/download/).

You need additionally Camunda-XQuery and Saxon, which do not come with the distribution. Obtain as follows:

```sh
cd camunda-bpm-tomcat-7.14.0/server/apache-tomcat-9.0.36/lib/
wget https://repo1.maven.org/maven2/net/sf/saxon/Saxon-HE/9.6.0-6/Saxon-HE-9.6.0-6.jar
wget https://repo1.maven.org/maven2/org/camunda/template-engines/camunda-template-engines-xquery-saxon/2.0.0/camunda-template-engines-xquery-saxon-2.0.0.jar
```
