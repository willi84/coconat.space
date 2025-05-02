


# Setup
The setup consists of four parts:
* working sheet: a google sheet that already exists for the kitchen
* Hub: a google sheet that connects to the working google sheet and the script to provide the API
* API: a script that formats the data and provides it to the frontend
* Frontend: a web app that displays the data in a nice way if needed


## google sheets
The hub sheet has multiple tabs:
* global
* config
* data
* dataNextMonth


### named functions

* `search_term` is the term you want to search for in the config sheet
* `col_letter` is the letter of the column you want to get sth. from
* `row` is the row you want to get sth. from
* `exclude_regex` is the regex that excludes certain words from the search
* `col_number` is the internal number of the column (1 = A, 2 = B, ..., 27 = AA, etc.)
* `month` is the month you want to get the data from
* `config_key` is the key you want to get the value from the config sheet

#### ⚛️ atomic functions

| Function Name     | Description       | Example           |
|------------------|------------------|------------------|
|**GET_ROW(search_term)**|get row with search term in config sheet|`=MATCH(search_term; config!$A:$A; 0)`|
|**GET_REF(col_letter)**|get reference of the column letter in the config sheet|`=INDIRECT("config!" & col_letter & ":" & col_letter)`|
|**COL_INDEX_TO_LETTER(col_number)**|Converts a numeric column index (e.g. 33) to corresponding column letter (e.g. "AG").|`=REGEXEXTRACT(ADDRESS(1; col_number; 4); "[A-Z]+")`|

#### 🧬 molecule functions

| Function Name     | Description       | Example           |
|------------------|------------------|------------------|
|**GET_VALUE_BY_COL(search_term)**|get value of the search term by specified column|`=INDEX(GET_REF(col_letter); GET_ROW(search_term))`|
|**GET_COLUMN(config_key)**|get column of the specific config key|`=INDEX(config!$D:$D; GET_ROW(config_key))`|


##### **GET_MATCHING_INDEX(search_term; row; exclude_regex)**
get index of the first header cell that contains search_term but does not match any words in exclude_regex. 
```
=MATCH(
  1;
  ARRAYFORMULA(
    REGEXMATCH(GET_HEADER_ROW(row); ".*" & LOWER(search_term) & ".*") *
    NOT(REGEXMATCH(GET_HEADER_ROW(row); LOWER(exclude_regex)))
  );
  0
)
```

##### GET_HEADER_ROW(row)
 Returns a cleaned and normalized version of the specified header row from the imported sheet (based on current month).
```
=ARRAYFORMULA(
  LOWER(TRIM(
    INDEX(
      IMPORTRANGE(GET_VALUE("url"); TEXT(TODAY(); "MMMM") & "!1:1");
      row;
      0
    )
  ))
)
```
  * `row` The row number to scan (usually 1 for header)	

#### 🦠 main functions
##### GET_VALUE(search_term)
returns the value of the search term in the config sheet
```
=IF(
  GET_VALUE_BY_COL("B"; search_term) <> "";
  GET_VALUE_BY_COL("B"; search_term);
  GET_VALUE_BY_COL("D"; search_term)
)
```
  * `search_term` is the term you want to search for in the config sheet

##### GET_EXCLUDE(search_term)
returns the value of the search term in the config sheet
```
=IF(
  GET_VALUE_BY_COL("C"; search_term)<> ""; 
  GET_VALUE_BY_COL("C"; search_term)
)
```
  * `search_term` is the term you want to search for in the config sheet

##### GET_REAL_DATA(month, search_term)
returns the values of the search term in the data sheet
```
=IMPORTRANGE(GET_VALUE("url"); GET_VALUE(month) & "!" & GET_COLUMN(config_key) & ":" & GET_COLUMN(config_key))
```
  * `month` month you want to get the data from
  * `config_key` ID of the column you want to get the data from

##### GET_COL_LETTER_FILTERED(search_term, row, exclude_regex)
Returns the column letter of the first header cell that contains search_term but does not match any words in exclude_regex.

```
=COL_INDEX_TO_LETTER(GET_MATCHING_INDEX(search_term; row; exclude_regex))
```
  * `search_term` term you want to search for in the config sheet
  * `row` row you want to search in
  * `exclude_regex` regex that excludes certain words from the search
 


## limits
* new sheets by year