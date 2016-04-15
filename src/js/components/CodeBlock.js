import React from 'react';
import MarkdownIt from 'markdown-it';
import Block from './Block';
import Visualiser from './visualiser/Visualiser';
import { codeToText, highlight } from '../util';
import { executeCodeBlock } from '../actions';

const md = new MarkdownIt({highlight});

class CodeBlock extends Block {

    constructor(props) {
        super(props);
        this.clickPlay = this.clickPlay.bind(this);
    }

    rawMarkup(codeBlock) {
        return {
            __html: md.render(codeToText(codeBlock))
        };
    }

    clickPlay() {
        const { dispatch, block } = this.props;
        dispatch(executeCodeBlock(block));
    }

    renderViewerMode() {
        const { block, hasBeenRun, result } = this.props;
        const icon = hasBeenRun ? "fa-repeat" : "fa-play-circle-o";
        return (
            <div className="codeContainer">
                <div className="codeBlock">
                    <div onClick={this.enterEdit}
                        dangerouslySetInnerHTML={this.rawMarkup(block)}>
                    </div>
                    <i className={"fa " + icon} onClick={this.clickPlay}></i>
                </div>
                <div hidden={!hasBeenRun} className="graphBlock"
                    id={"kajero-graph-" + block.get('id')}>
                </div>
                <div hidden={!hasBeenRun} className="resultBlock">
                    <Visualiser
                        data={result}
                        useHljs='true'
                    />
                </div>
            </div>
        );
    }

}

export default CodeBlock;