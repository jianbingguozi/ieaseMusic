import { songState } from '@/stores/controller';
import classnames from 'classnames';
import AudioPlayer from 'components/AudioPlayer';
import Menu from 'components/Menu';
import Offline from 'components/Offline';
import Playing from 'components/Playing';
import ProgressImage from 'components/ProgressImage';
import PlayerMode from 'components/Ripple/PlayerMode';
import PlayerNavigation from 'components/Ripple/PlayerNavigation';
import PlayerStatus from 'components/Ripple/PlayerStatus';
import VolumeUpDown from 'components/Ripple/VolumeUpDown';
import Share from 'components/Share';
import UpNext from 'components/UpNext';
import React, { FC } from 'react';
import { useEffectOnce, useNetwork, useWindowSize } from 'react-use';
import { useRecoilValue } from 'recoil';
import styles from './index.less';

const Background = () => {
    const song = useRecoilValue(songState);
    const { width } = useWindowSize();

    return (
        <div className={styles.cover}>
            {song && song.id ? (
                <ProgressImage
                    className={styles.background}
                    {...{
                        width,
                        src: `${song.album.cover.replace(/\?param=.*/, '')}?param=800y800`,
                    }}
                />
            ) : (
                false
            )}
        </div>
    );
};

interface ILayoutProps {}

const Layout: FC<ILayoutProps> = (props) => {
    const { children } = props;
    // const store = useStore();
    // const { me, preferences } = store;

    useEffectOnce(() => {
        const init = async () => {
            // await preferences.init();
            // await me.init();
            // const { username, password } = preferences.lastFm;
            // await lastfm.initialize(username, password);
        };
        init();
    });

    const networkState = useNetwork();
    if (!networkState.online) {
        return <Offline show />;
    }
    return (
        <div className={styles.container}>
            <main
                className={classnames({
                    [styles.viewport]: true,
                })}>
                {children}
            </main>
            <AudioPlayer />
            <UpNext />
            <Share />
            {/* <Preferences /> */}
            <Menu />
            <VolumeUpDown />
            <Playing />
            <PlayerNavigation />
            <PlayerMode />
            <PlayerStatus />
            <Background />
        </div>
    );
};

export default Layout;
