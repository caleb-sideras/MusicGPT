import axios, { AxiosResponse, AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { HighLevelData, HighLevel, RateLimitInfo, AudioProperties } from '@/types';

const hld = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { mbid } = req.query;

        const baseUrl = `https://acousticbrainz.org/api/v1/${mbid}/high-level`;
        // const response: AxiosResponse = await axios.get(baseUrl);
        const response:any = {"data" :{"highlevel":{"danceability":{"all":{"danceable":0.997903466225,"not_danceable":0.00209652073681},"probability":0.997903466225,"value":"danceable","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"gender":{"all":{"female":0.5298396945,"male":0.4701603055},"probability":0.5298396945,"value":"female","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"genre_dortmund":{"all":{"alternative":0.00273150880821,"blues":0.000205446733162,"electronic":0.995782375336,"folkcountry":0.00048383086687,"funksoulrnb":2.51455840043e-05,"jazz":0.000344945059624,"pop":6.37958437437e-05,"raphiphop":1.01915993582e-05,"rock":0.000352766684955},"probability":0.995782375336,"value":"electronic","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"genre_electronic":{"all":{"ambient":0.20587939024,"dnb":0.00759718287736,"house":0.382751762867,"techno":0.01690656133,"trance":0.386865109205},"probability":0.386865109205,"value":"trance","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"genre_rosamerica":{"all":{"cla":0.00208739330992,"dan":0.240247964859,"hip":0.0779462829232,"jaz":0.00794084556401,"pop":0.122060231864,"rhy":0.529739320278,"roc":0.0135611500591,"spe":0.00641679903492},"probability":0.529739320278,"value":"rhy","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"genre_tzanetakis":{"all":{"blu":0.0617713928223,"cla":0.0343018434942,"cou":0.102904699743,"dis":0.0514719486237,"hip":0.154438391328,"jaz":0.309046447277,"met":0.0441263727844,"pop":0.0772129744291,"reg":0.0617708563805,"roc":0.102955065668},"probability":0.309046447277,"value":"jaz","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"ismir04_rhythm":{"all":{"ChaChaCha":0.284644067287,"Jive":0.0921898186207,"Quickstep":0.0283834729344,"Rumba-American":0.0522273629904,"Rumba-International":0.0751167237759,"Rumba-Misc":0.0420311838388,"Samba":0.116673223674,"Tango":0.204950287938,"VienneseWaltz":0.0848197489977,"Waltz":0.0189641006291},"probability":0.284644067287,"value":"ChaChaCha","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"mood_acoustic":{"all":{"acoustic":0.0793263614178,"not_acoustic":0.92067360878},"probability":0.92067360878,"value":"not_acoustic","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"mood_aggressive":{"all":{"aggressive":1.96228704397e-08,"not_aggressive":1},"probability":1,"value":"not_aggressive","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"mood_electronic":{"all":{"electronic":0.822695612907,"not_electronic":0.177304387093},"probability":0.822695612907,"value":"electronic","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"mood_happy":{"all":{"happy":0.585427820683,"not_happy":0.414572179317},"probability":0.585427820683,"value":"happy","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"mood_party":{"all":{"not_party":0.983008921146,"party":0.0169910956174},"probability":0.983008921146,"value":"not_party","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"mood_relaxed":{"all":{"not_relaxed":0.174945548177,"relaxed":0.825054466724},"probability":0.825054466724,"value":"relaxed","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"mood_sad":{"all":{"not_sad":0.659035086632,"sad":0.340964913368},"probability":0.659035086632,"value":"not_sad","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"moods_mirex":{"all":{"Cluster1":0.116201534867,"Cluster2":0.213332563639,"Cluster3":0.199891939759,"Cluster4":0.122022785246,"Cluster5":0.348551183939},"probability":0.348551183939,"value":"Cluster5","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"timbre":{"all":{"bright":0.875208258629,"dark":0.124791748822},"probability":0.875208258629,"value":"bright","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"tonal_atonal":{"all":{"atonal":0.401199817657,"tonal":0.598800182343},"probability":0.598800182343,"value":"tonal","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}},"voice_instrumental":{"all":{"instrumental":0.69205313921,"voice":0.30794686079},"probability":0.69205313921,"value":"instrumental","version":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"}}},"metadata":{"audio_properties":{"analysis_sample_rate":44100,"bit_rate":320029,"codec":"mp3","downmix":"mix","equal_loudness":0,"length":292.597564697,"lossless":0,"md5_encoded":"29d3461affd6c53ca84719f3150446bc","replay_gain":-11.260263443,"sample_rate":44100},"tags":{"album":["Dj Beats Volume 8"],"albumartist":["Mastermix"],"artist":["Daft Punk"],"bpm":["116"],"composer":["Bangalter, de Homem-Christo, Pharrell Williams, Rodgers"],"contentgroup":["6"],"copyright":["2013 Mastermix"],"date":["2013"],"discnumber":["1"],"encodedby":["Intermezzo Music & Media Group -- Http://Intermezzogroup.Com"],"file_name":"copy4772436038269504492.mp3","genre":["Dance"],"initialkey":["Bm"],"musicbrainz_recordingid":["0347d102-b653-4c6c-a0b2-cc9a58c5c585"],"title":["Get Lucky"],"tracknumber":["1"]},"version":{"highlevel":{"essentia":"2.1-beta5-dev","essentia_build_sha":"e74af04b57b164eed312abeef4963962215860f0","essentia_git_sha":"v2.1_beta4-674-g8c1d4f0","extractor":"music 2.0","gaia":"2.4.5","gaia_git_sha":"v2.4.4-44-g95f4851","models_essentia_git_sha":"v2.1_beta1"},"lowlevel":{"essentia":"2.1-beta2","essentia_build_sha":"cead25079874084f62182a551b7393616cd33d87","essentia_git_sha":"v2.1_beta2-1-ge3940c0","extractor":"music 1.0"}}}}}
        const extractedData: HighLevel[] = [];

        for (const key in response.data.highlevel) {
            const item = response.data.highlevel[key];
            extractedData.push({
                probability: item.probability,
                value: item.value
            });
        }
        
        const highLevelData: HighLevelData = {
            high_level: extractedData,
            audio_properties: {
                bit_rate: response.data.metadata.audio_properties.bit_rate,
                length: response.data.metadata.audio_properties.length,
                replay_gain: response.data.metadata.audio_properties.replay_gain,
                sample_rate: response.data.metadata.audio_properties.sample_rate
            } as AudioProperties,
        }

        res.status(200).json(highLevelData);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 429) {
                const rateLimitInfo: RateLimitInfo = {
                    limit: axiosError.response.headers['x-ratelimit-limit'],
                    remaining: axiosError.response.headers['x-ratelimit-remaining'],
                    reset: axiosError.response.headers['x-ratelimit-reset'],
                };
                console.log('Rate limit exceeded. Rate limit info:', rateLimitInfo);
                res.status(429).json(rateLimitInfo);
            }
            else if (axiosError.response?.status === 404) {
                res.status(404).json('error');
            }
            else {
                res.status(500).json('error');
            }
        }
        else {
            res.status(500).json('error');
        }
    }
};

export default hld;