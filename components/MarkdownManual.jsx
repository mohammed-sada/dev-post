import ReactMarkdown from 'react-markdown';

export default function MarkdownManual({ setShowMarkdown }) {
  const orderedList = `
  1. List Item 1 
  2. List Item 2 
  3. List Item 3
  `;

  const unOrderedList1 = `
  * List Item 1 
  * List Item 2 
  * List Item 3
  `;

  const unOrderedList2 = `
  - List Item 1 
  - List Item 2 
  - List Item 3
  `;

  const nestedList = `
  1. OL item 1
     * UL item 1.1
     * UL item 1.2
     * UL item 1.3
  2. OL item 2
     * UL item 2.1
     * UL item 2.2
     * UL item 2.3
  `;

  const codeBlock = `${'```'}
  function myCode(){
      var a = 5;
  }
  ${'```'}`;

  const blockQuote = `
  > Blockquote
  `;

  return (
    <div className='text-center font-semibold '>
      <div className='text-2xl flex justify-between'>
        <button className='text-red-500' onClick={() => setShowMarkdown(false)}>
          Close Manual
        </button>
        <h3>React-Markdown - Manual</h3>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Element</th>
            <th>Markdown Syntax</th>
            <th>Rendered by React-Markdown</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Heading 1 </td>
            <td># Heading 1</td>
            <td>
              <ReactMarkdown># Heading 1</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Heading 2 </td>
            <td>## Heading 2</td>
            <td>
              <ReactMarkdown>## Heading 2</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Heading 3 </td>
            <td>### Heading 3</td>
            <td>
              <ReactMarkdown>### Heading 3</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Heading 4 </td>
            <td>#### Heading 4</td>
            <td>
              <ReactMarkdown>#### Heading 4</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Heading 5 </td>
            <td>##### Heading 5</td>
            <td>
              <ReactMarkdown>##### Heading 5</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Heading 6 </td>
            <td>###### Heading 6</td>
            <td>
              <ReactMarkdown>###### Heading 6</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Bold </td>
            <td>**Bold**</td>
            <td>
              <ReactMarkdown>**Bold**</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Italics</td>
            <td>*Italics*</td>
            <td>
              <ReactMarkdown>*Italics*</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Ordered List</td>
            <td>
              1. List Item 1<br />
              2. List Item 2<br />
              3. List Item 3
            </td>
            <td style={{ textAlign: 'left' }}>
              <ReactMarkdown children={orderedList} />
            </td>
          </tr>
          <tr>
            <td>Unordered List</td>
            <td>
              (Using *)
              <br />
              <br />
              * List Item 1<br />
              * List Item 2<br />
              * List Item 3<br />
              <br />
              (Using -)
              <br />
              <br />
              - List Item 1<br />
              - List Item 2<br />
              - List Item 3<br />
            </td>
            <td style={{ textAlign: 'left' }}>
              {'(Using *)'}
              <ReactMarkdown children={unOrderedList1} />
              {'(Using -)'}
              <ReactMarkdown children={unOrderedList2} />
            </td>
          </tr>
          <tr>
            <td>
              Nested List <br /> (Use 3 space indentation in children lists)
            </td>
            <td style={{ textAlign: 'left' }}>
              1. OL item 1<br />
              &nbsp;&nbsp;&nbsp;* UL Item 1.1
              <br />
              &nbsp;&nbsp;&nbsp;* UL Item 1.2
              <br />
              &nbsp;&nbsp;&nbsp;* UL Item 1.3
              <br />
              2. OL item 2<br />
              &nbsp;&nbsp;&nbsp;* UL Item 2.1
              <br />
              &nbsp;&nbsp;&nbsp;* UL Item 2.2
              <br />
              &nbsp;&nbsp;&nbsp;* UL Item 2.3
              <br />
            </td>
            <td style={{ textAlign: 'left' }}>
              <ReactMarkdown children={nestedList} />
            </td>
          </tr>
          <tr>
            <td>Inline Code</td>
            <td>`Code`</td>
            <td>
              <ReactMarkdown>`Code`</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Code Block</td>
            <td style={{ textAlign: 'left' }}>
              ```
              <br />
              {'function myCode(){'} <br />
              &nbsp;&nbsp;&nbsp;&nbsp;{'var a = 5;'} <br />
              {'}'} <br />
              ```
            </td>
            <td style={{ textAlign: 'left' }}>
              <ReactMarkdown children={codeBlock} />
            </td>
          </tr>
          <tr>
            <td>Horizontal Rule</td>
            <td>---</td>
            <td>
              <ReactMarkdown>---</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Blockquote</td>
            <td style={{ textAlign: 'left' }}>&gt; Blockquote</td>
            <td>
              <ReactMarkdown children={blockQuote} />
            </td>
          </tr>
          <tr>
            <td>Link</td>
            <td style={{ textAlign: 'left' }}>[title](https://example.com)</td>
            <td>
              <ReactMarkdown>[title](https://example.com)</ReactMarkdown>
            </td>
          </tr>
          <tr>
            <td>Image</td>
            <td style={{ textAlign: 'left' }}>
              ![alt_text](https://example.com/image.jpg)
            </td>
            <td>
              <ReactMarkdown>
                ![title](https://upload.wikimedia.org/wikipedia/commons/6/62/INSTEAD-Logo-small.png)
              </ReactMarkdown>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
