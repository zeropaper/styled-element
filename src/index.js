import { CssSelectorParser } from 'css-selector-parser';

const selectorParser = new CssSelectorParser();

export const getElementSelector = (css) => {
  // a valid selector is needed for the generation of the tag
  const selector = /^([^{]+)\s*[^:]*\s*\{/.exec(css);
  if (!selector || !selector[1]) throw new Error('No valid selector');
  return selector[1];
};

// retrieve or create a "global" style element
// which holds the styles of all styledElements
// and ensure it is in the document's head
export const ensureStyleElement = () => {
  const styleEl = document.getElementById('styled-element') || document.createElement('style');
  if (!document.head.contains(styleEl)) {
    document.head.appendChild(styleEl);
  }
  return styleEl;
};

export const parseCSSRules = (css, selector, elementSelector) => css
  .split(/^}/gm)
  .filter(str => str.trim())
  .map(str => str.split(selector.trim()).join(elementSelector));

export const attributesObjectToArray = (object) => {
  const array = [];
  Object.keys(object).forEach((name) => {
    array.push({ name, value: object[name] });
  });
  return array;
};

let counter = 0;
export default function styledElement(css, originalAttributes = {}) {
  const selector = getElementSelector(css);
  const elementClassname = `se-${counter}`;
  const elementSelector = `.${elementClassname}`;
  counter += 1;

  const styleEl = ensureStyleElement();

  const parsed = selectorParser.parse(selector);
  const definition = parsed.rule || parsed.selectors.shift().rule;
  const { tagName, attrs } = definition;
  const elementAttributes = [...(attrs || []), ...attributesObjectToArray(originalAttributes)];

  // in order to allow several rules to be passed (to define states like :hover, :focus...)
  // we need to split and add the seperately
  const rules = parseCSSRules(css, selector, elementSelector);
  // eslint-disable-next-line no-console
  console.log('rules', rules);
  rules.forEach(rule => `${styleEl.sheet.insertRule(rule)}}`);

  return (inner = '', additionalAttributes = {}) => {
    const element = document.createElement(tagName || 'div');
    element.className = elementClassname;

    [
      ...elementAttributes,
      ...attributesObjectToArray(additionalAttributes),
    ].forEach((attr) => {
      const isEventAttr = attr.name.indexOf('on') === 0;

      if (isEventAttr && typeof attr.value === 'function') {
        element.addEventListener(attr.name.slice(2), attr.value);
      } else if (isEventAttr && Array.isArray(attr.value)) {
        element.addEventListener(attr.name.slice(2), ...attr.value);
      } else {
        element.setAttribute(attr.name, attr.value);
      }
    });

    if (typeof inner === 'string') {
      element.textContent = inner;
    } else if (inner instanceof HTMLElement) {
      element.appendChild(inner);
    }

    return element;
  };
}
