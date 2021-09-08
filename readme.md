# JSON CLI Tool

Extract map and filter json output. (lightweight jq alternative)

# Installation

```
npm i -g json-cli-tool
```

# Usage

```sh
jc help
```

```sh
jc [keys|values] --path="cars"

Commands:
  jc keys    Object keys
  jc values  Object values

Options:
      --version        Show version number                             [boolean]
  -p, --path           path in json                                     [string]
  -f, --filter         Filter array function                            [string]
  -m, --map            Map array function                               [string]
  -q, --query          Query json using jamespath                       [string]
  -o, --output         Output format
     [choices: "table", "log", "stringify", "newline", "env", "count"] [default:
                                                                          "log"]
  -l, --limit          Limit array size                                 [number]
      --flatMap, --fm  Flatmap array function                           [string]
  -c, --config         config file path                                 [string]
      --help           Show help                                       [boolean]

Examples:
  jc keys --path="cars"     Goto .cars, and Print keys
  jc values --path="names"  Goto .names, and Print values
```

```sh
{json} | jc --path="names" --filter="name=jay" --map="name"
{json} | jc --query=".names[]" // jmespath compatible
{json} | jc keys
{json} | jc values
```

```sh
echo '{"a":1,"b":2,"c":[1,2,3,4,5],"d":{"a":2,"b":3},"e":[{"a":1,"b":2,"c":[1,2,3,4,5],"d":{"a":2,"b":5}},{"a":2,"b":3,"c":[1,2,3,4,5],"d":{"a":2,"b":4}}]}' | jc --p="e" --m="a,b" --f="a=2"
# { a: 2, b: 3 }
```

```sh
curl --location --request GET 'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json' | jc --path 'dataseries' --map 'temp2m,prec_type' --filter 'temp2m=29'
```
