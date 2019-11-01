# tranquility-utility

This repository's purpose is to make tranquility in Drexel's CS-164 easier to execute.

## Current features

- Can access all jsons from a single tranq.html

- Can clear output in the textarea by clicking the clear button

- Can specify json file via going to https://cs.drexe.edu/~your_drexel_id/tranq.html?f=your_json_file_name.json

- Can predict json file name given name if no f is specified. For example,
  
  [https://cs.drexe.edu/~your_drexel_id/adder.html](https://cs.drexe.edu/~your_drexel_id/tranq.html)
  
  will get adder.json while
  
  [https://cs.drexe.edu/~your_drexel_id/hello.html](https://cs.drexe.edu/~your_drexel_id/tranq.html)
  
  will search for hello.json

## How to use

1. Clone this reposility and copy the contents of the git repository to your public_html directory into your home directory by running
   
   ```
   git clone https://github.com/isamu-isozaki/tranquility-utility.git
   cp -r tranquility-utility/* ~/public_html
   ```
   
   in your tux server.

2. If you need a specific file name like hello.html for submission, just do
   
   ```
   cp ~/public_html/tranq.html ~/public_html/hello.html
   ```
   
   or whatever the name is and the site will access the json with that name. For example, in this case it will look for hello.json

## TODO

- Run tranquility code files directly from website

## Credits

tranq.js is taken from slightly modifying Professor Brian Stuart's code from [here](https://www.cs.drexel.edu/~bls96/tvm.js)


























