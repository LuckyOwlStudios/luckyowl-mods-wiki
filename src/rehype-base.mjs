// Prefixes site-absolute links and media in markdown ("/mods/...") with the
// configured base path, so content works on GitHub Pages project sites too.
export default function rehypeBase(base = '/') {
  const prefix = base.replace(/\/$/, '');
  return () => (tree) => {
    if (!prefix) return;
    const visit = (node) => {
      if (node.type === 'element' && node.properties) {
        for (const attr of ['src', 'href', 'poster']) {
          const v = node.properties[attr];
          if (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(prefix + '/')) node.properties[attr] = prefix + v;
        }
      }
      (node.children || []).forEach(visit);
    };
    visit(tree);
  };
}
