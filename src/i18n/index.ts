// @Isanchezv
// src/i18n/index.ts
import english from './en.json';
import es from './es.json';

const LANG = {
	ENGLISH: 'en',
	SPANISH: 'es',
};

export const getI18N = ({
	currentLocale = 'es',  
}: {
	currentLocale: string | undefined;
}) => {
	if (currentLocale === LANG.ENGLISH) return {...es, ...english};
	return es;
};