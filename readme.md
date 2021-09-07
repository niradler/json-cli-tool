# JSON CLI Tool

Extract map and filter json output. (lightweight jq alternative)

# Installation

```
npm i -g json-cli-tool
```

# Usage

```
jc help
```

```
{output json} | jc --path="names" --filter="name=jay" --map="name"
{output json} | jc --query=".names[]" // jmespath compatible
{output json} | jc keys
{output json} | jc values
```

```
gkc search repos -p="q=org:niradler" | jc --p="items" --m="name,fork" --f="fork=false"

```
