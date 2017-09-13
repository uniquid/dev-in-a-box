```docker build -t dashboard .```    
```docker run --rm -p 8081:8081 --name dash dashboard```   

open browser @ http://localhost    

provide a conf.json file    
```docker run -v /absolute/path/to/my-conf.json:/html/conf.json --rm -p 80:80 --name dash dashboard```      
