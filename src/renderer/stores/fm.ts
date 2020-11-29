import ISong from '@/interface/ISong';
import { fmTrash, getPlaylist } from 'api/fm';
import IPlayList from 'interface/IPlayList';
import { makeAutoObservable, runInAction } from 'mobx';
import controller from './controller';

class FM {
    loading = true;

    song: ISong = {
        duration: 0
    };

    playlist: IPlayList = {
        songs: []
    };

    constructor() {
        makeAutoObservable(this);
    }

    preload = () => {
        controller.changeMode();
        this.shuffle();
        this.preload = Function;
    };

    async shuffle() {
        this.loading = true;

        const data = await getPlaylist();
        runInAction(() => {
            this.playlist = data;
            const [song] = this.playlist.songs;
            this.song = song;
            this.loading = false;
        });
    }

    play = () => {
        if (controller.playlist.id === this.playlist.id) {
            controller.toggle();
            return;
        }

        controller.setup(this.playlist);
        controller.play();
    };

    // Ban a song

    ban = async (id: number) => {
        const data = await fmTrash(id);
        if (data.code === 200) {
            this.next();
        }
    };

    next = async () => {
        let index = this.playlist.songs.findIndex(e => e.id === controller.song.id);

        if (controller.playlist.id !== this.playlist.id) {
            this.play();
            return;
        }

        if (++index < this.playlist.songs.length) {
            const next = this.playlist.songs[index];

            controller.play(next.id);
            return;
        }

        // Refresh the playlist
        await this.shuffle();
        controller.setup(this.playlist);
        controller.play();
    };
}

const fm = new FM();
export default fm;
