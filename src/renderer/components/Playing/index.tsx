import classnames from 'classnames';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import FadeImage from '/@/components/FadeImage';
import Indicator from '/@/components/Indicator';
import Artist from '/@/interface/Artist';
import { playListState, songState } from '/@/stores/controller';
import { filteredSongsState, playingShowState } from '/@/stores/playing';
import colors from '/@/utils/colors';

const Playing = () => {
    const [show, setShow] = useRecoilState(playingShowState);
    const filteredSongs = useRecoilState(filteredSongsState);
    const playList = useRecoilValue(playListState);
    const controllerSong = useRecoilValue(songState);

    const listRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    if (!show) {
        return null;
    }

    const pressEscExit = (e: any) => {
        if (e.keyCode === 27) {
            setShow(false);
        }
    };

    const highlight = (offset: number) => {
        const songs = Array.from(listRef.current.querySelectorAll('[data-id]'));
        let index = songs.findIndex((e) => e.classList.contains(styles.active));

        if (index > -1) {
            songs[index].classList.remove(styles.active);
        }

        index += offset;

        if (index < 0) {
            // Fallback to the last element
            index = songs.length - 1;
        } else if (index > songs.length - 1) {
            // Fallback to the 1th element
            index = 0;
        }

        const active = songs[index];

        if (active) {
            // Keep active item always in the viewport
            active.classList.add(styles.active);
            // @ts-ignore
            listRef.current.scrollTop = active.offsetTop + active.offsetHeight - listRef.current.offsetHeight;
        }
    };

    const navigation = (e: any) => {
        const { keyCode } = e;
        // @ts-ignore
        const offset = {
            // Up
            '38': -1,
            // Down
            '40': +1,
        }[keyCode];

        if (offset) {
            highlight(offset);
        }

        if (keyCode !== 13) {
            return;
        }
        const active = listRef.current.querySelector(`.${styles.active}`);

        if (active) {
            // @ts-ignore
            const songid = active.dataset.id;
            // controller.play(songid);
        }
    };

    const renderList = () => {
        // const { filtered } = playing;
        let list = playList.songs;
        if (searchRef.current && searchRef.current.value.trim()) {
            list = filteredSongs;
        }
        if (list.length === 0) {
            return <div className={styles.nothing}>Nothing ...</div>;
        }
        return list.map((e) => {
            const playing = e.id === controllerSong.id;

            return (
                <li key={e.id}>
                    <div className={styles.actions}>{playing ? <Indicator /> : false}</div>

                    <aside
                        className={classnames(styles.song, {
                            [styles.playing]: playing,
                        })}
                        data-id={e.id}
                        onClick={() => {
                            // play(e.id);
                            close();
                        }}>
                        <Link to={e.album.link}>
                            <FadeImage src={e.album.cover} />
                        </Link>

                        <aside>
                            <p className={styles.title}>{e.name}</p>
                            <p className={styles.author}>
                                {e.artists.map((d: Artist) => {
                                    return (
                                        <Link key={d.link} to={d.link}>
                                            {d.name}
                                        </Link>
                                    );
                                })}
                            </p>
                        </aside>

                        <div
                            className={styles.mask}
                            style={{
                                background: colors.randomGradient(),
                            }}
                        />
                    </aside>
                </li>
            );
        });
    };

    return (
        <div className={styles.container} onKeyUp={(e) => pressEscExit(e)} ref={containerRef} tabIndex={-1}>
            <div className={styles.overlay} onClick={close} />

            <section>
                <header>
                    <input
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => playing.filter(e.target.value)}
                        onKeyUp={navigation}
                        placeholder="Search..."
                        ref={searchRef}
                        type="text"
                    />
                </header>

                <ul className={styles.list} ref={listRef}>
                    {renderList()}
                </ul>
            </section>
        </div>
    );
};

export default Playing;
