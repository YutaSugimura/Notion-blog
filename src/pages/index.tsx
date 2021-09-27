import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import type { PostList, TitleProperty } from '../types/notion';
import { getDatabaseData, getPageData } from '../scripts/notion';
import { Header } from '../components/organisms/header';
import { Footer } from '../components/organisms/footer';
import { Category } from '../components/atoms/category';

// export const getStaticProps: GetStaticProps<Props> = async () => {
//   return {
//     props: {
//       siteTitle: await getPageData(),
//       postList: await getDatabaseData(),
//     },
//   };
// };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      title: await getPageData(),
      archive: await getDatabaseData(),
    },
  };
};

type Props = {
  title: TitleProperty;
  archive: PostList;
};

const Page: NextPage<Props> = ({ title, archive }) => {
  const siteTitle = title !== null ? title.plain_text : '';

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Header />
        <main className="container mx-auto min-h-screen px-4">
          <h1 className="text-center text-lg title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 dark:text-white">
            {siteTitle}
          </h1>

          <div className="pt-20">
            <h2>Archive</h2>
            <ul className="divide-y divide-gray-300">
              {archive !== null &&
                archive.map((item) => (
                  <li key={item.id} className="divide-y divide-yellow-500">
                    <Link href={`/archive/${item.id}`}>
                      <div className="hover:bg-gray-100 px-3 py-1.5 items-center">
                        <p className="text-gray-700 dark:text-white text-2xl">
                          {item.title !== null ? item.title.plain_text : ''}
                        </p>

                        <div className="flex flex-row justify-between items-center">
                          <div>
                            {item.categories !== null &&
                              item.categories.map((category, index) => (
                                <Category
                                  key={category.id}
                                  category={category}
                                  marginLeft={index !== 0 ? true : false}
                                />
                              ))}
                          </div>

                          <span className="text-gray-400 text-sm">{item.publishedAt}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Page;