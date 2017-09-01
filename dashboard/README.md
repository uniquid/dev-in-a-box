```docker build -t dashboard .```
```docker run --rm -p 8080:8080 --name dash dashboard```

open browser @ http://localhost:8080

provide a conf.json file
```docker run -v /absolute/path/to/my-conf.json:/html/conf.json --rm -p 8080:8080 --name dash dasoard```  
