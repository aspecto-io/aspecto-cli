import axios from 'axios';

export default async (url: string) => {
    try {
        await axios.head(url);
        return true;
    } catch (err) {
        return false;
    }
};
