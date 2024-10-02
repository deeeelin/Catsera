import { Helmet } from 'react-helmet-async';

import { CoursesView } from 'src/sections/viewcourses/view';

// ----------------------------------------------------------------------

export default function ViewCoursesPage() {
  return (
    <>
      <Helmet>
        <title> Journey | Catsera </title>
      </Helmet>

      <CoursesView />
    </>
  );
}
