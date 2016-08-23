# Philips Hue Prototype

### Running
```
$ npm start
```

### Feature list

- [x] Handle lazy loaded images
- [x] Handle async content e.g. react / infinite scroll
- [x] Cache `color-thief` calls
- [ ] [RGB to CIE 1931 X,Y format](https://github.com/bjohnso5/hue-hacking#srccolorsjs) for Philips Hue
- [ ] Give user control to select which room
- [ ] Save settings on a global or per site basis
- [ ] (LOW PRIORITY) Implement an algorithm to get 3 brightest colors

### Edge cases / questions

- How do we handle if more than one image is in viewport e.g. instagram layout
- How do we tie into lightbox style plugins
