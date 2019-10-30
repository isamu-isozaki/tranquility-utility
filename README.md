# tranquility-utility

This repository's purpose is to make tranquility in Drexel's CS-164 easier to execute.

## Current features

- Can access all jsons from a single tranq.html

- Can clear output in the textarea by clicking the clear button

## How to use

1. Clone this reposility into your home directory by running
   
   ```
   git clone https://github.com/isamu-isozaki/tranquility-utility.git
   ```
   
   in your tux server.

2.  Copy the contents of the git repository to your public_html directory.

   
   ```
   cp tranquility-utility/* ~/public_html
   ```

3. Go to https://cs.drexe.edu/~<insert_your_drexel_id>/tranq.html

## Bugs

- The previous json file runs one time before it stops running.

## TODO

- Run tranquility code files directly from website

- Run from url

## Credits

tranq.js is taken from slightly modifying Professor Brian Stuart's code from [here](https://www.cs.drexel.edu/~bls96/tvm.js)
