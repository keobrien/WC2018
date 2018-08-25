# Build process automation
For WordCamp 2018 by Kevin O'Brien

## Included

### bitbucket-pipelines.yml

An example BitBucket pipeline files that copies WordPress source wp-content files into another repository that contains the full WordPress core files. Can be adapted to also run a build preocess for a theme or plugin and deploy the resulting built files to avoid committing built files to the source repository.

### package.json & web pack.config.js

A simple set of build configuration files covered in the presentation.

- Javascript - Combine, minify, ES6 transpiling with source maps
- CSS - Combine, minify, SASS, auto vendor prefixing, extract css from Javascript output
- Images & Fonts - Copy and add a hash based off the file name

Bonus points

- ESLint for JavaScript code style
- Husky Git hooks 
- OS notifications for build events