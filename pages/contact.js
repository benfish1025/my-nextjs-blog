import { Fragment } from 'react';
import Head from 'next/head';

import ContactForm from '../components/contact-form/contact-form';

function ContactPage() {
  return (
    <Fragment>
      <Head>
        <title>留言板</title>
        <meta name='description' content='告诉我你的想法!' />
      </Head>
      <ContactForm />
    </Fragment>
  );
}

export default ContactPage;
