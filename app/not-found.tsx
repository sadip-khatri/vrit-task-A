import Link from 'next/link';
export default function NotFound(){return <div className="error-page"><span className="eyebrow">404 — Not found</span><h1>This piece has <em>moved on.</em></h1><p>It looks like this page is no longer here. There are plenty more good things to find.</p><Link className="button-primary" href="/products">Back to the collection <span>↗</span></Link></div>}
