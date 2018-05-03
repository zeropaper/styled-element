# styled-element

Experiment to generate DOM elements from CSS.

## Installation

`npm i zeropaper/styled-element`

## Usage

```js
import styledElement from 'styled-element';

const styledSpan = styledElement(`span.magic {
  display: block;
  color: #fff;
  background-color: #000;
  transition: color 218ms ease,
              background-color 218ms ease;
}

span.magic:hover {
  color: #fff;
  background-color: #000;
}`, {
  onmouseover: (event) => {
    console.log('common %s event', event.type);
  },
});

const spanElement = styledSpan('Some text', {
  onmouseout: (event) => {
    console.log('specific %s event', event.type);
  },
});

document.appendChild(spanElement);
```

## Author

Valentin `zeropaper` Vago

## License

Apache 2
See the LICENSE file.