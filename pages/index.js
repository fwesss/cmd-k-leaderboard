import { useState, useEffect } from 'react';

import Head from 'next/head';

import { Box } from '@chakra-ui/react';

import Header from '../components/Header';
import Container from '../components/Container';
import SignInModal from '../components/SignInModal';
import AddCompanyModal from '../components/AddCompanyModal';
import Footer from '../components/Footer';
import { useSupabase } from '../hooks/useSupabase.js';

export default function Home() {
  const FILTER_ENUM = {
    TOP: 'votes',
    NEW: 'created_at',
  };

  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [voteOptions, setVoteOptions] = useState([]);
  const [session, setSession] = useState();
  const [user, setUser] = useState();
  const [filter, setFilter] = useState(FILTER_ENUM.TOP);
  const [active, setActive] = useState(false);
  const [userVotes, setUserVotes] = useState();
  const [votesLoading, setVotesLoading] = useState(false);

  const supabase = useSupabase();

  async function submitOption(option) {
    const response = await supabase.from('options').insert({
      name: option.name,
      url: option.url,
      created_by: user.id,
      submitted_by_user: option.isUser,
    });

    if (response.data && response.data.length) {
      setVoteOptions([...voteOptions, response.data[0]]);
    }
    console.log(response);
  }

  function toggleAdd() {
    if (user || showAdd) {
      setShowAdd(!showAdd);
    } else {
      setShowSignIn(true);
    }
  }

  async function getOptions(user) {
    setVotesLoading(true);
    const { data: options, error } = await supabase
      .from('options')
      .select()
      .order(filter, { ascending: false });
    console.log(options);
    setVoteOptions(options);

    if (user) {
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('option_id')
        .eq('user_id', user.id);

      setUserVotes(votes);

      if (votesError) {
        console.error(votesError);
      }
    }
    setVotesLoading(false);
  }

  console.log('userVotes', userVotes);

  useEffect(() => {
    getOptions(user);
  }, [user, filter]);

  const Toggle = async (id, selected, setSelected) => {
    if (!user) {
      setShowSignIn(!showSignIn);
      return;
    }

    if (user) {
      setVotesLoading(true);
      const { data: options, error: optionsError } = await supabase
        .from('options')
        .select('id, name, votes')
        .eq('id', id);

      if (optionsError) {
        console.error(optionsError);
      }

      const { id: optionId, votes: optionVotes } = options[0];

      const voted = userVotes.map((vote) => vote.option_id).includes(optionId);

      optionVotes += voted ? -1 : 1;

      const { data, error } = await supabase
        .from('options')
        .update({ votes: optionVotes })
        .eq('id', id);

      if (error) {
        console.log(error);
      }

      if (!voted) {
        setSelected(true);

        const { data: votes, error: profilesError } = await supabase
          .from('votes')
          .insert([
            {
              user_id: user.id,
              // user_email: user.email,
              option_id: optionId,
            },
          ]);

        setUserVotes([...userVotes, { option_id: id }]);
      } else {
        setSelected(false);
        const { data, error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('option_id', id);

        if (error) {
          console.log(error);
        }
        setUserVotes(userVotes.filter((vote) => vote.option_id !== id));
      }
      getOptions();
    }
  };

  async function signInWithGithub() {
    await supabase.auth.signIn({
      provider: 'github',
    });
  }

  async function signInWithGoogle() {
    await supabase.auth.signIn({
      provider: 'google',
    });
  }

  async function handleSignOut() {
    let { error } = await supabase.auth.signOut();

    location.reload();

    if (error) {
      console.log(error);
    }
  }

  console.log('user', user);
  // Add auth for twitter when live
  // async function signInWithTwitter() {
  //   await supabase.auth.signIn({
  //     provider: "twitter",
  //   });
  // }
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session.user);
      supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
        })
        .then((res) => console.log(res));
    });
  }, []);

  return (
    //
    <>
      {/* <Box
        w="100vw"
        h="90vh"
        marginLeft="auto"
        marginRight="auto"
        maxWidth="1280px"
        position="relative"
        font-family="Inter"
        justifyContent="center"
      >
        <Head>
          <title>CMD k Leaderboard</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={user} session={session} handleSignOut={handleSignOut} />

        <Box
          width="100%"
          h="70vh"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          as="main" */}
      <Box
        w="100vw"
        h="90vh"
        d="flex"
        flexDirection="column"
        alignItems="center"
        font-family="Inter"
      >
        <Head>
          <title>CMD k Leaderboard</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header user={user} session={session} handleSignOut={handleSignOut} />

        <Box
          width="100%"
          h="65vh"
          maxH="65vh"
          overflowY="scroll"
          display="flex"
          justifyContent="center"
          as="main"
          flexWrap="wrap"
          // flexFlow="column-reverse wrap"
          justifyContent="center"
          alignItems="center"
        >
          <Container
            options={voteOptions}
            Toggle={Toggle}
            toggleAdd={toggleAdd}
            submitOption={submitOption}
            userVotes={userVotes}
            filter={filter}
            setFilter={setFilter}
            votesLoading={votesLoading}
          />

          <SignInModal
            show={showSignIn}
            title="My Modal"
            Toggle={Toggle}
            signInWithGithub={signInWithGithub}
            signInWithGoogle={signInWithGoogle}
          />
          <AddCompanyModal
            show={showAdd}
            Toggle={toggleAdd}
            submitOption={submitOption}
          />
        </Box>
      </Box>
      <Footer />
    </>
  );
}
