import Head from 'next/head';

export default function Metatags({
  title = 'WebDev',
  description = 'A wonderful WebDev website for web development related posts and blogs',
  image = 'https://logopond.com/logos/66b46ed55ef37e6271cd99b6a705c611.png',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@muhamedWebdev' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />

      <link rel='icon' href='/favicon.png' />
    </Head>
  );
}
