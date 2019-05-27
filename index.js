#!/usr/bin/env node

const { readFile } = require( 'fs' ),
  { join } = require( 'path' );

readFile( join( process.cwd(), 'package.json' ), 'utf8', ( err, data ) => {

  const { dependencies, devDependencies } = JSON.parse( data );

  if ( dependencies ) {
    console.log( '# dependencies' );
    console.log( `npm i -S ${ Object.keys( dependencies ).map( d => `${ d }@latest` ).join( ' ' ) }` );
  }

  if ( devDependencies ) {
    console.log( '# devDependencies' );
    console.log( `npm i -S ${ Object.keys( devDependencies ).map( d => `${ d }@latest` ).join( ' ' ) }` );
  }

} );