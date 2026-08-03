# Partners page integration

The redesigned `partners.html` is included with:

- Media partner pathway
- Community partner pathway
- Event partner pathway
- Auto-scrolling and swipeable community partner rail
- Platinum, Gold, Silver and Bronze event tiers
- Responsive desktop, tablet and mobile layouts

## Replace placeholder partner cards

In `partners.html`, locate `.partner-logo-card` elements and replace the placeholder initials with actual logo images and partner names.

Example:

```html
<article class="partner-logo-card">
  <img
    class="partner-logo-image"
    src="resources/images/partner-name.webp"
    alt="Partner Name logo"
  />
  <div>
    <strong>Partner Name</strong>
    <small>Community Partner</small>
  </div>
</article>
```

The page loads `assets/partners-page.css` and `assets/partners-page.js` in addition to the shared site files.
