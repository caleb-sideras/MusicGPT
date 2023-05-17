import { Lite, Pro, General } from '@/components/Features/Features';
import React from 'react';
import Head from 'next/head'
import Artist from '@/components/Songs/Artist';
import { GeniusFormattedData, HighLevelData, LowLevelData, Style } from '@/types';
import { useHiddenData } from "@/utils/context/song_data_context";
import router from 'next/router';


export default function Chat() {
    const { setHiddenData } = useHiddenData();

    const inlineStyles = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    const introStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_pic1.png')"
    }
    const proStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_pro.png')"
    }
    const liteStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_lite.png')"
    }
    const exampleSongs = [
        {
            artist: 'Kendrick Lamar',
            title: 'N95',
            duration: 1272623,
            year: 2022,
            imageUrl: 'https://images.genius.com/2f8cae9b56ed9c643520ef2fd62cd378.300x300x1.png',
            musicBrainzID: '6476b30b-0c08-4305-9acb-9dfd8f3f36f8',
            highLevel: {
                "high_level": [
                    {
                        "probability": 0.949734270573,
                        "value": "danceable"
                    },
                    {
                        "probability": 0.994705021381,
                        "value": "male"
                    },
                    {
                        "probability": 0.986267387867,
                        "value": "electronic"
                    },
                    {
                        "probability": 0.5339884758,
                        "value": "ambient"
                    },
                    {
                        "probability": 0.38053175807,
                        "value": "hip"
                    },
                    {
                        "probability": 0.313974827528,
                        "value": "jaz"
                    },
                    {
                        "probability": 0.416245400906,
                        "value": "Tango"
                    },
                    {
                        "probability": 0.633097112179,
                        "value": "not_acoustic"
                    },
                    {
                        "probability": 0.781112909317,
                        "value": "not_aggressive"
                    },
                    {
                        "probability": 0.838694810867,
                        "value": "electronic"
                    },
                    {
                        "probability": 0.611337602139,
                        "value": "not_happy"
                    },
                    {
                        "probability": 0.671940028667,
                        "value": "not_party"
                    },
                    {
                        "probability": 0.576854407787,
                        "value": "relaxed"
                    },
                    {
                        "probability": 0.694295108318,
                        "value": "not_sad"
                    },
                    {
                        "probability": 0.270947486162,
                        "value": "Cluster3"
                    },
                    {
                        "probability": 0.96565002203,
                        "value": "dark"
                    },
                    {
                        "probability": 0.775041699409,
                        "value": "atonal"
                    },
                    {
                        "probability": 0.712734818459,
                        "value": "voice"
                    }
                ],
                "audio_properties": {
                    "bit_rate": 320043,
                    "length": 196.048980713,
                    "replay_gain": -14.2629241943,
                    "sample_rate": 44100
                }
            } as HighLevelData,
            lowLevel: {
                "lowlevel": {
                    "average_loudness": 0.904448390007,
                    "dynamic_complexity": 4.05292749405,
                    "mfcc_mean": [
                        -690.94128418,
                        135.235839844,
                        8.64085483551,
                        13.9327831268,
                        3.17590069771,
                        4.75754594803,
                        -4.38371992111,
                        6.16389608383,
                        -5.06001186371,
                        3.01963543892,
                        7.17056941986,
                        3.75802731514,
                        -0.14584428072
                    ]
                },
                "rhythm": {
                    "bpm": 139.857192993,
                    "danceability": 1.32800769806,
                    "onset_rate": 5.16144037247,
                    "beats_count": 455
                },
                "tonal": {
                    "chords_changes_rate": 0.0686715617776,
                    "chords_key": "A#",
                    "chords_number_rate": 0.0028415818233,
                    "chords_scale": "minor",
                    "key_key": "A#",
                    "key_scale": "minor",
                    "key_strength": 0.560762643814,
                    "tuning_diatonic_strength": 0.447002261877,
                    "tuning_equal_tempered_deviation": 0.160220593214,
                    "tuning_frequency": 434.193115234,
                    "tuning_nontempered_energy_ratio": 0.827534019947
                },
                "metadata": {
                    "audio_properties": {
                        "analysis_sample_rate": 44100,
                        "replay_gain": -14.2629241943,
                        "length": 196.048980713,
                        "bit_rate": 320043
                    }
                }
            } as LowLevelData,
            geniusID: '7995415',
            genius: {
                "artist_names": "Kendrick Lamar",
                "apple_music_player_url": "https://genius.com/songs/7995415/apple_music_player",
                "description": "“N95” is the second track on Kendrick Lamar’s fifth and final studio album with Top Dawg Entertainment, Mr. Morale & The Big Steppers. The song’s title refers to N95 face masks, which have been one of the several key tools adopted to contrast the COVID-19 pandemic. Throughout this track, Kendrick addresses futile and superficial coping mechanisms, while pointing out at the facades a lot of people have acquired, which he also discussed on the previous song from the album, “United in Grief”.\n\nSome fans interpreted phrases like “You’re back outside, but they still lied” and the refrain “take off” as the artist’s criticism of the way the U.S. government (first under Donald Trump, and then under Joe Biden) handled the state of emergency in response to the pandemic. However, in the wider context of the whole album, these references are more likely metaphors not just for people’s hypocrisy and “clout chase,” but for Kendrick’s own pretense and facade, as well, as he “took them off” in order to confront his “ugliness” and experience the first phases of his healing process.\n\nThis song’s bridge, alongside the first half of the third verse, were originally meant to appear on Baby Keem’s “vent”, but Kendrick ended up only providing vocals on the chorus.\n\nIn September of 2020, Kendrick was spotted filming a music video for this song, hovering over the beach. Two years later, hours after the album’s release, Dave Free teased the music video on his Twitter with a clip from the aforementioned shoot; Kendrick’s posture closely resembles that of Jesus Christ on the cross. This coincides with the religious themes found on Mr. Morale, as well as the cover art, where Kendrick is depicted wearing a crown of thorns.\n\nOn May 14, 2022, just a day after the release of Mr. Morale & The Big Steppers, the official music video was shared on YouTube.",
                "embed_content": "<div id='rg_embed_link_7995415' class='rg_embed_link' data-song-id='7995415'>Read <a href='https://genius.com/Kendrick-lamar-n95-lyrics'>“N95” by Kendrick Lamar</a> on Genius</div> <script crossorigin src='//genius.com/songs/7995415/embed.js'></script>",
                "full_title": "N95 by Kendrick Lamar",
                "header_image_thumbnail_url": "https://images.genius.com/2f8cae9b56ed9c643520ef2fd62cd378.300x300x1.png",
                "lyrics": "[Intro]\nHello, new world, all the boys and girlsI got some true stories to tell\nYou're back outside, but they still lied\n\n\n[Verse 1]\nTake off the foo-foo, take off the clout chase, take off the Wi-Fi\n\nTake off the weird-ass jewelry, I'ma take ten steps, then I'm taking off top five\nTake off them fabricated streams and them microwave memes, it's a real world outside (Take that shit off)\nTake off your idols, take off the runway, I take off to Cairo (Take that shit off)Take off to Saint-Tropez, five-day stay, take a quarter mill', hell, if I know (Take that shit off)\n\n\nTake off the fake deep, take off the fake woke, take off the, \"I'm broke, I care\" (Take it off)\n\nTake off the Chanel, take off the Dolce, take off the Birkin bag(Take it off)Take all that designer bullshit off, and what do you have?\n\n[Chorus]\nBitch, huh, huh, ughYou ugly as fuck (You outta pocket)\n\n\n\n\n\n\n[Verse 2]\nThe world in a panic, the women is stranded, the men on a runThe prophets abandoned, the law take advantage, the market is crashin', the industry wantsNiggas and bitches to sleep in a box while they makin' a mockery followin' usThis ain't Monopoly, watchin' for love, this ain't monogamy, y'all gettin' fucked\n\n\nI'm done with the sensitive, takin' it personal, done with the black and the white, the wrong and the right\n\n\n[Chorus]\nBitch, huh, huh, ughYou ugly as fuck\n\n\n\n\n\n\n\n[Bridge]\nServin' up a look, dancin' in a drought\nHello to the big stepper, never losin' count\nVentin' in the safe houseVentin' in the sa—[Verse 3: Kendrick Lamar & Baby Keem]\nCan I vent all my truth? I got nothin' to lose, I got problems and pools, I can swim on my faith\n\n\n\n\n\n\nWould you sell your bro for leverage? (Let's go)\nWhere the hypocrites at?What community feel they the only ones relevant? (Let's go)Where the hypocrites at?What community feel they the only ones relevant? (Let's go)\n\n[Outro]\n\n\n\nYou entertainin' old friends when they toxic (This shit hard)\n\nWhat the fuck is cancel culture, dawg?Say what I want about you niggas, I'm like Oprah, dawgI treat you crackers like I'm Jigga, watch, I own it all\n"
            } as GeniusFormattedData
        },
        {
            artist: 'Taylor Swift',
            title: 'Bad Blood',
            duration: 751048,
            year: 2014,
            imageUrl: 'https://images.genius.com/f2bfbf2d1b827e9a99b47a9f287d6108.300x300x1.jpg',
            musicBrainzID: '914f6a27-fce4-4a75-9267-049b51a1b086',
            highLevel: {
                "high_level": [
                    {
                        "probability": 0.997724413872,
                        "value": "danceable"
                    },
                    {
                        "probability": 0.999744296074,
                        "value": "female"
                    },
                    {
                        "probability": 0.982741117477,
                        "value": "electronic"
                    },
                    {
                        "probability": 0.415671825409,
                        "value": "trance"
                    },
                    {
                        "probability": 0.5209441185,
                        "value": "pop"
                    },
                    {
                        "probability": 0.310666948557,
                        "value": "jaz"
                    },
                    {
                        "probability": 0.365819275379,
                        "value": "ChaChaCha"
                    },
                    {
                        "probability": 0.982150375843,
                        "value": "not_acoustic"
                    },
                    {
                        "probability": 0.999991118908,
                        "value": "not_aggressive"
                    },
                    {
                        "probability": 0.552347064018,
                        "value": "electronic"
                    },
                    {
                        "probability": 0.844226181507,
                        "value": "not_happy"
                    },
                    {
                        "probability": 0.624378919601,
                        "value": "party"
                    },
                    {
                        "probability": 0.81493884325,
                        "value": "not_relaxed"
                    },
                    {
                        "probability": 0.863618373871,
                        "value": "not_sad"
                    },
                    {
                        "probability": 0.404840171337,
                        "value": "Cluster4"
                    },
                    {
                        "probability": 0.796107232571,
                        "value": "dark"
                    },
                    {
                        "probability": 0.566089451313,
                        "value": "tonal"
                    },
                    {
                        "probability": 0.512579023838,
                        "value": "instrumental"
                    }
                ],
                "audio_properties": {
                    "bit_rate": 0,
                    "length": 211.933334351,
                    "replay_gain": -13.8776092529,
                    "sample_rate": 44100
                }
            } as HighLevelData,
            lowLevel: {
                "lowlevel": {
                    "average_loudness": 0.799459993839,
                    "dynamic_complexity": 4.55800533295,
                    "mfcc_mean": [
                        -675.461547852,
                        105.494277954,
                        -7.03366565704,
                        14.9254388809,
                        5.28626775742,
                        -0.223672673106,
                        12.6085624695,
                        2.25757431984,
                        1.22655677795,
                        6.71093797684,
                        -3.58066916466,
                        5.93030309677,
                        1.88589763641
                    ]
                },
                "rhythm": {
                    "bpm": 85.1347503662,
                    "danceability": 1.27470195293,
                    "onset_rate": 4.04809093475,
                    "beats_count": 398
                },
                "tonal": {
                    "chords_changes_rate": 0.044906899333,
                    "chords_key": "G",
                    "chords_number_rate": 0.00153340632096,
                    "chords_scale": "major",
                    "key_key": "G",
                    "key_scale": "major",
                    "key_strength": 0.601395189762,
                    "tuning_diatonic_strength": 0.559418737888,
                    "tuning_equal_tempered_deviation": 0.169413641095,
                    "tuning_frequency": 434.193115234,
                    "tuning_nontempered_energy_ratio": 0.882993400097
                },
                "metadata": {
                    "audio_properties": {
                        "analysis_sample_rate": 44100,
                        "replay_gain": -13.8776092529,
                        "length": 211.933334351,
                        "bit_rate": 0
                    }
                }
            } as LowLevelData,
            geniusID: '551262',
            genius: {
                "artist_names": "Taylor Swift",
                "apple_music_player_url": "https://genius.com/songs/551262/apple_music_player",
                "description": "As Swift said in her Rolling Stone interview:\n\n\nFor years, I was never sure if we were friends or not. She would come up to me at awards shows and say something and walk away, and I would think, ‘Are we friends, or did she just give me the harshest insult of my life?’ Then last year, the other star crossed a line.\n\nShe did something so horrible. I was like, ‘Oh, we’re just straight-up enemies.’ And it wasn’t even about a guy! It had to do with business. She basically tried to sabotage an entire arena tour. She tried to hire a bunch of people out from under me. And I’m surprisingly non-confrontational – you would not believe how much I hate conflict. So now I have to avoid her. It’s awkward, and I don’t like it.\n\n\nMuch speculation has been made about who this song is about, with one popular theory suggesting Katy Perry. Perry seemed to think so herself, tweeting the day after the Rolling Stone feature was published:\n\nhttps://twitter.com/katyperry/status/509247190280065025",
                "embed_content": "<div id='rg_embed_link_551262' class='rg_embed_link' data-song-id='551262'>Read <a href='https://genius.com/Taylor-swift-bad-blood-lyrics'>“Bad Blood” by Taylor Swift</a> on Genius</div> <script crossorigin src='//genius.com/songs/551262/embed.js'></script>",
                "full_title": "Bad Blood by Taylor Swift",
                "header_image_thumbnail_url": "https://images.genius.com/d022400aad4680759c278a348d5aaa9b.300x300x1.png",
                "lyrics": "[Chorus]\n'Cause baby, now we've got bad blood\nYou know it used to be mad love\nSo take a look what you've done'Cause baby, now we've got bad blood, hey!\nNow we've got problemsAnd I don't think we can solve 'emYou made a really deep cutAnd baby, now we've got bad blood, hey!\n\n[Verse 1]\n\n\nDid you have to ruin what was shiny?Now it's all rusted\n\n\n\nSalt in the wound like you're laughing right at me\n\n[Pre-Chorus]\n\n\n\n\n[Chorus]\n'Cause baby, now we've got bad blood\nYou know it used to be mad love\nSo take a look what you've done'Cause baby, now we've got bad blood, hey!\nNow we've got problemsAnd I don't think we can solve 'emYou made a really deep cutAnd baby, now we've got bad blood, hey!\n[Verse 2]\nDid you think we'd be fine?Still got scars on my back from your knivesSo don't think it's in the pastThese kinds of wounds, they last and they last\n\n\nAnd time can heal, but this won't\n\n\n\n[Pre-Chorus]\n\n\n\n\n[Chorus]\n'Cause baby, now we've got bad blood\nYou know it used to be mad love\nSo take a look what you've done'Cause baby, now we've got bad blood, hey!\nNow we've got problemsAnd I don't think we can solve 'emYou made a really deep cutAnd baby, now we've got bad blood, hey!\n[Bridge]\nBand-aids don't fix bullet holesYou say sorry just for showIf you live like that, you live with ghostsBand-aids don't fix bullet holesYou say sorry just for showIf you live like that, you live with ghostsIf you love like that, blood runs cold\n\n[Chorus]\n'Cause baby, now we've got bad blood\nYou know it used to be mad love\nSo take a look what you've done'Cause baby, now we've got bad blood, hey!\nNow we've got problemsAnd I don't think we can solve 'em (Think we can solve 'em)You made a really deep cutAnd baby, now we've got bad blood, hey!\n'Cause baby, now we've got bad blood\nYou know it used to be mad love\nSo take a look what you've done (Look what you've done)'Cause baby, now we've got bad blood, hey!\nNow we've got problemsAnd I don't think we can solve 'emYou made a really deep cutAnd baby, now we've got bad blood, hey!"
            } as GeniusFormattedData
        },
        {
            artist: 'Daft Punk',
            title: 'Get Lucky',
            duration: 4079615,
            year: 2013,
            imageUrl: 'https://images.genius.com/8a0047cdcf7b02c9dcb1185119a82adb.300x300x1.jpg',
            musicBrainzID: '0347d102-b653-4c6c-a0b2-cc9a58c5c585',
            highLevel: {
                "high_level": [
                    {
                        "probability": 0.997903466225,
                        "value": "danceable"
                    },
                    {
                        "probability": 0.5298396945,
                        "value": "female"
                    },
                    {
                        "probability": 0.995782375336,
                        "value": "electronic"
                    },
                    {
                        "probability": 0.386865109205,
                        "value": "trance"
                    },
                    {
                        "probability": 0.529739320278,
                        "value": "rhy"
                    },
                    {
                        "probability": 0.309046447277,
                        "value": "jaz"
                    },
                    {
                        "probability": 0.284644067287,
                        "value": "ChaChaCha"
                    },
                    {
                        "probability": 0.92067360878,
                        "value": "not_acoustic"
                    },
                    {
                        "probability": 1,
                        "value": "not_aggressive"
                    },
                    {
                        "probability": 0.822695612907,
                        "value": "electronic"
                    },
                    {
                        "probability": 0.585427820683,
                        "value": "happy"
                    },
                    {
                        "probability": 0.983008921146,
                        "value": "not_party"
                    },
                    {
                        "probability": 0.825054466724,
                        "value": "relaxed"
                    },
                    {
                        "probability": 0.659035086632,
                        "value": "not_sad"
                    },
                    {
                        "probability": 0.348551183939,
                        "value": "Cluster5"
                    },
                    {
                        "probability": 0.875208258629,
                        "value": "bright"
                    },
                    {
                        "probability": 0.598800182343,
                        "value": "tonal"
                    },
                    {
                        "probability": 0.69205313921,
                        "value": "instrumental"
                    }
                ],
                "audio_properties": {
                    "bit_rate": 320029,
                    "length": 292.597564697,
                    "replay_gain": -11.260263443,
                    "sample_rate": 44100
                }
            } as HighLevelData,
            lowLevel: {
                "lowlevel": {
                    "average_loudness": 0.954425871372,
                    "dynamic_complexity": 3.68808960915,
                    "mfcc_mean": [
                        -680.256103516,
                        119.997123718,
                        26.3763084412,
                        24.4594993591,
                        17.1860637665,
                        5.40795660019,
                        -0.350716799498,
                        1.74360442162,
                        2.41026520729,
                        1.94251000881,
                        -0.993750631809,
                        2.30169487,
                        0.899221837521
                    ]
                },
                "rhythm": {
                    "bpm": 116.033065796,
                    "danceability": 1.62000346184,
                    "onset_rate": 5.76519823074,
                    "beats_count": 564
                },
                "tonal": {
                    "chords_changes_rate": 0.0501428134739,
                    "chords_key": "B",
                    "chords_number_rate": 0.00158679788001,
                    "chords_scale": "minor",
                    "key_key": "A",
                    "key_scale": "major",
                    "key_strength": 0.533393681049,
                    "tuning_diatonic_strength": 0.461225479841,
                    "tuning_equal_tempered_deviation": 0.188811868429,
                    "tuning_frequency": 434.193115234,
                    "tuning_nontempered_energy_ratio": 0.924058735371
                },
                "metadata": {
                    "audio_properties": {
                        "analysis_sample_rate": 44100,
                        "replay_gain": -11.260263443,
                        "length": 292.597564697,
                        "bit_rate": 320029
                    }
                }
            } as LowLevelData,
            geniusID: '139968',
            genius: {
                "artist_names": "Daft Punk",
                "apple_music_player_url": "https://genius.com/songs/139968/apple_music_player",
                "description": "The lead single from Daft Punk’s fourth and final studio album, Random Access Memories, “Get Lucky” was first teased in snippets on Saturday Night Live. It peaked in the top 3 in every country it charted in and, because of its performance in the United States, got the duo their first song to reach the top 10 on the Billboard charts. According to an interview with Pitchfork, the original version featured the Wurlitzer electronic piano, but because of the revisions, took 18 months to complete from start to finish.",
                "embed_content": "<div id='rg_embed_link_139968' class='rg_embed_link' data-song-id='139968'>Read <a href='https://genius.com/Daft-punk-get-lucky-lyrics'>“Get Lucky” by Daft Punk</a> on Genius</div> <script crossorigin src='//genius.com/songs/139968/embed.js'></script>",
                "full_title": "Get Lucky by Daft Punk (Ft. Nile Rodgers & Pharrell Williams)",
                "header_image_thumbnail_url": "https://images.genius.com/440d158f53bf17abbb5a362259942639.300x300x1.jpg",
                "lyrics": "[Verse 1: Pharrell Williams]\nLike the legend of the phoenix, huhAll ends with beginnings\nWhat keeps the planet spinning, uh-huhThe force from the beginningLook\n\n[Pre-Chorus: Pharrell Williams]\nWe've come too farTo give up who we are\nSo let's raise the barAnd our cups to the stars\n\n[Chorus: Pharrell Williams]\nShe's up all night 'til the sunI'm up all night to get someShe's up all night for good funI'm up all night to get lucky\nWe're up all night 'til the sunWe're up all night to get someWe're up all night for good funWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get lucky\n[Verse 2: Pharrell Williams]\nThe present has no ribbonYour gift keeps on giving\nWhat is this I'm feeling?If you wanna leave, I'm with it, uh-huh\n\n[Pre-Chorus: Pharrell Williams]\nWe've come too farTo give up who we are\nSo let's raise the barAnd our cups to the stars\n\n[Chorus: Pharrell Williams]\nShe's up all night 'til the sunI'm up all night to get someShe's up all night for good funI'm up all night to get lucky\nWe're up all night 'til the sunWe're up all night to get someWe're up all night for good funWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get lucky\n[Chorus: Pharrell Williams]\nShe's up all night 'til the sunI'm up all night to get someShe's up all night for good funI'm up all night to get lucky\nWe're up all night 'til the sunWe're up all night to get someWe're up all night for good funWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get lucky\n\n[Chorus: Pharrell Williams]\nShe's up all night 'til the sunI'm up all night to get someShe's up all night for good funI'm up all night to get lucky\nWe're up all night 'til the sunWe're up all night to get someWe're up all night for good funWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get lucky\n[Bridge: Daft Punk]\nWe're up all night to getWe're up all night to getWe're up all night to getWe're up all night to getWe're up all night to getWe're up all night to getWe're up all night to getWe're up all night to getWe're up all night to get back togetherWe're up all night to get (Let's get funked again)We're up all night to get (Funky)We're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get lucky\n\n[Pre-Chorus: Pharrell Williams]\nWe've come too farTo give up who we are\nSo let's raise the barAnd our cups to the stars\n\n[Chorus: Pharrell Williams]\nShe's up all night 'til the sunI'm up all night to get someShe's up all night for good funI'm up all night to get lucky\nWe're up all night 'til the sunWe're up all night to get someWe're up all night for good funWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get lucky\n\n[Outro: Pharrell Williams]\nWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get luckyWe're up all night to get lucky"
            } as GeniusFormattedData
        },
    ]

    const gotoExampleSong = (genius_id: string, music_brainz_id: string, high_level: HighLevelData, low_level: LowLevelData, genius: GeniusFormattedData) => {
        setHiddenData({
            id: music_brainz_id,
            high_level: high_level,
            low_level: low_level,
            genius: genius,
        });

        router.push({
            pathname: '/lite/chat',
            query: { genius: genius_id, music_brainz: music_brainz_id },
        });
    }

    return (
        <>
            <Head>
                <title>MusicGPT</title>
                <meta name="description" content="Discuss various aspects of a song in natural language with MusicGPT Lite & Pro." />
                <meta name="keywords" content="musicgpt, gpt, ai, music, songs" />
                <meta property="og:title" content="MusicGPT" />
                <meta property="og:description" content="Discuss various aspects of a song in natural language with MusicGPT Lite & Pro." />
                <meta property="og:image" content="https://www.music-gpt.vercel.app/musicgpt.png" />
            </Head>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 grid- lg:gap-4 gap-y-4">
                    <div style={introStyles} className="flex md:flex-row flex-col col-span-1 md:col-span-2 lg:col-span-10 rounded-lg justify-space-between gap-4 p-4 text-on-surface w-full h-fill">
                        <General />
                        <div>
                            <div className='flex flex-col gap-2 p-4 text-on-surface w-full h-fill bg-tertiary rounded-t-lg'>
                                <div className='text-4xl font-bold text-on-tertiary'>Examples</div>
                                <div className='text-tertiary-container'>Below are some examples that showcase MusicGPT Lite features</div>
                            </div>
                            <div className='border-tertiary border bg-tertiary-container rounded-b-lg'>
                                {exampleSongs.map((song, index) => (
                                    <>
                                        <div className="border-t border-tertiary w-full" />
                                        <Artist key={index} onClick={() => gotoExampleSong(song.geniusID, song.musicBrainzID, song.highLevel, song.lowLevel, song.genius)} style={Style.home} artist={song.artist} title={song.title} duration={song.duration} year={song.year} imageUrl={song.imageUrl} />
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={liteStyles} className="col-span-1 md:col-span-2 lg:col-span-4 rounded-lg p-4 w-full h-fill">
                        <Lite />
                    </div>

                    <div style={proStyles} className="col-span-1 md:col-span-2 lg:col-span-6 rounded-lg p-4 w-full h-fill">
                        <Pro />
                    </div>
                </div>
            </div>
        </>
    )
}