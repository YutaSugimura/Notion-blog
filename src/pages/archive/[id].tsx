import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import type { Blocks, Categories, TitleProperty } from '../../types/notion';
import { getBlocksData, getChildPageData } from '../../scripts/notion';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Category } from '../../components/atoms/category';

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const postPageId = query.id as string;

  const { title, createdAt, categories, thumbnail } = await getChildPageData(postPageId);

  return {
    props: {
      title,
      createdAt,
      categories,
      thumbnail,
      contents: await getBlocksData(postPageId),
    },
  };
};

type Props = {
  title: TitleProperty;
  createdAt: string;
  categories: Categories;
  thumbnail: string;
  contents: Blocks;
};

const Page: NextPage<Props> = ({ title, createdAt, categories, thumbnail, contents }) => {
  const siteTitle = title !== null ? title.plain_text : '';

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Header canGoBack={true} />

        <main className="container mx-auto min-h-screen px-4 pt-9">
          <article>
            <h1 className="text-4xl mb-4 font-medium text-gray-900 dark:text-white">{siteTitle}</h1>

            <div className="flex max-w-full pt-3">
              <span className="ml-auto">{createdAt}</span>
            </div>

            <div className="flex justify-end pt-2">
              {categories !== null &&
                categories.map((category, index) => (
                  <Category
                    key={category.id}
                    category={category}
                    marginLeft={index !== 0 ? true : false}
                  />
                ))}
            </div>

            {thumbnail !== '' && (
              <div className="flex flex-wrap relative w-full h-96 mt-3">
                <img
                  src={thumbnail}
                  className="block absolute h-full w-full object-cover object-center inset-0"
                />
              </div>
            )}

            <div className="pt-3">
              {contents.map((item) => {
                if (item.type === 'heading_1') {
                  return (
                    <h1 key={item.id} className="text-3xl">
                      {item.text}
                    </h1>
                  );
                } else if (item.type === 'heading_2') {
                  return (
                    <h2 key={item.id} className="text-2xl">
                      {item.text}
                    </h2>
                  );
                } else if (item.type === 'heading_3') {
                  return (
                    <h3 key={item.id} className="text-xl">
                      {item.text}
                    </h3>
                  );
                } else if (item.type === 'paragraph') {
                  if (item.text === '') {
                    return <div key={item.id} style={{ height: 20 }} />;
                  }
                  if (item.href !== '') {
                    return (
                      <a
                        key={item.id}
                        className="hover:text-gray-300 text-base underline tracking-tight"
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.text}
                      </a>
                    );
                  }
                  return (
                    <p key={item.id} className="text-lg tracking-tight">
                      {item.text}
                    </p>
                  );
                } else if (item.type === 'bulleted_list_item') {
                  return <li key={item.id}>{item.text}</li>;
                } else if (item.type === 'numbered_list_item') {
                  return <ol key={item.id}>{item.text}</ol>;
                } else if (item.type === 'image') {
                  return <img src={item.image.url} width={200} height={200} alt="image" />;
                } else if (item.type === 'unsupported') {
                  return <div key={item.id} style={{ height: 20 }} />;
                }
              })}
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Page;
