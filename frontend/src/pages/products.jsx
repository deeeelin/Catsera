import { Helmet } from 'react-helmet-async';

import { JourneyView } from 'src/sections/journey/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Journey | Catsera </title>
      </Helmet>

      <JourneyView />
    </>
  );
}
