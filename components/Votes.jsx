import React, { useState } from 'react';

import { Box, Button } from '@chakra-ui/react';

import Vote from './Vote';
import AddCompanyModal from './AddCompanyModal';

const Votes = ({
  options,
  Toggle,
  toggleAdd,
  userVotes = [],
  filter,
  setFilter,
}) => {
  console.log(Array.isArray(userVotes));
  console.log(userVotes);

  let votedArray = userVotes.map((vote) => vote.option_id);
  console.log('Voted Ids ', votedArray);
  const FILTER_ENUM = {
    TOP: 'votes',
    NEW: 'created_at',
  };
  return (
    <Box
      w="30%"
      h="100%"
      d="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <Box
        width="80%"
        bgColor="white"
        display="flex"
        justifyContent="space-around"
      >
        <Box>
          <Button
            mr="5px"
            colorScheme="transparent"
            color="black"
            bgColor="#cfccc4"
            onClick={() => setFilter(FILTER_ENUM.TOP)}
          >
            Top
          </Button>
          <Button
            colorScheme="transparent"
            color="black"
            bgColor="#cfccc4"
            onClick={() => setFilter(FILTER_ENUM.NEW)}
          >
            New
          </Button>
        </Box>
        <Button
          colorScheme="transparent"
          color="black"
          bgColor="#cfccc4"
          onClick={() => {
            toggleAdd();
          }}
        >
          Add app
        </Button>
      </Box>
      <Box
        width="80%"
        h="90%"
        display="flex"
        flexDir="column"
        alignItems="center"
        border="1px solid black"
      >
        {options.map((option) => (
          <Vote
            key={option.id}
            id={option.id}
            name={option.name}
            votes={option.votes}
            url={option.url}
            Toggle={Toggle}
            votedArray={votedArray}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Votes;
