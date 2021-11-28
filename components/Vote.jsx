import React, { useState, useEffect } from 'react';
import { TwitterShareButton } from 'react-twitter-embed';
import { TriangleUpIcon } from '@chakra-ui/icons';

import { Box, Button, Image, Link } from '@chakra-ui/react';

const Vote = ({ name, votes, url, Toggle, id, loading, votedArray = [] }) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (votedArray.includes(id)) {
      setSelected(true);
      console.log(`${name} is selected`);
    }
  }, [votedArray]);

  return (
    <Box
      w="90%"
      height="15%"
      mt="20px"
      p="5px"
      display="flex"
      justifyContent="space-around"
      flexWrap="wrap"
      alignItems="center"
    >
      <Box w="20%">
        <a href={`https://${url}`}>
          <Image
            alt="{name} logo"
            boxSize="40px"
            src={`https://logo.clearbit.com/${url}`}
          />
        </a>
      </Box>
      <Box width="30%"> {name} </Box>
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        border={
          selected ? '1px solid rgba(58, 40, 175, 1) ' : '1px solid #C4C4C4'
        }
        bgColor="white"
        width="20%"
        borderRadius="10px"
        p="3px"
      >
        <Button
          aria-label="Up vote"
          leftIcon={<TriangleUpIcon />}
          colorScheme="white"
          color={selected ? '#3A28AF' : '#4C5A7E'}
          //color to change to when selected #fcc732
          disabled={loading}
          onClick={() => {
            Toggle(id, selected, setSelected);
          }}
        >
          <Box>{votes ? `${votes}` : 0}</Box>
        </Button>
      </Box>
      <TwitterShareButton
        url={process.env.URL}
        options={{
          text: `${name} should be the next company to add Cmd+K to their site! @commandbar`,
        }}
      />
    </Box>
  );
};

export default Vote;
