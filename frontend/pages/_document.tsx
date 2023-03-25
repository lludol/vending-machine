import Document, {
	Html, Head, Main, NextScript, DocumentContext, DocumentProps,
} from 'next/document';
import { ComponentProps, ComponentType } from 'react';
import createEmotionServer from '@emotion/server/create-instance';
import { AppType } from 'next/app';
import { roboto } from '../style/theme';
import createEmotionCache from '../utils/createEmotionCache';
import { MyAppProps } from './_app';

interface MyDocumentProps extends DocumentProps {
	emotionStyleTags: JSX.Element[];
}

export default function MyDocument({ emotionStyleTags }: MyDocumentProps) {
	return (
		<Html lang="en" className={roboto.className}>
			<Head>
				<meta name="emotion-insertion-point" content="" />
				{emotionStyleTags}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
	const originalRenderPage = ctx.renderPage;

	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	ctx.renderPage = () => originalRenderPage({
		enhanceApp: (App: ComponentType<ComponentProps<AppType> & MyAppProps>) => function
		EnhanceApp(props) {
			return <App emotionCache={cache} {...props} />;
		},
	});

	const initialProps = await Document.getInitialProps(ctx);
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(' ')}`}
			key={style.key}
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return {
		...initialProps,
		emotionStyleTags,
	};
};
