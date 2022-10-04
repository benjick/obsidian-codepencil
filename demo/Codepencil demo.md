# Codepencil demo
```html
<div class="foo">
	<h2>This is a title</h2>
	<button id="button">Alert</button>
</div>
```

### test
```css
.foo {
	color: green;
}
```

```html
<p>Some more HTML</p>
```

```js
document.querySelector('#button').addEventListener('click', () => {
	alert("bar");
})
```
